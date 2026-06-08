//lib/notifications/service.ts
import type { NotificationType } from '@/lib/generated/prisma/client'
import { DeliveryStatus, SubscriberStatus } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'

import { appBaseUrl, sendMail } from '@/lib/mailer'
import { renderBrandedEmail } from '@/lib/emails/templates'
import { signPreferencesToken, signUnsubscribeToken } from '@/lib/newsletter-tokens'
import {
  DELIVERY_ERROR_MAX_LEN,
  DISPATCH_DEFAULT_MAX_EVENTS_PER_RUN,
  DISPATCH_DEFAULT_MAX_MS,
  DISPATCH_DEFAULT_MAX_SENDS_PER_RUN,
  DISPATCH_LOCK_LEASE_MS,
  NOTIFICATION_MAX_RETRY,
} from '@/lib/notifications/constants'

type CreateEventInput = {
  type: NotificationType
  title: string
  summary?: string
  url: string
  entityId?: string
}

export type DispatchOptions = {
  maxMs?: number
  maxSendsPerRun?: number
  maxEventsPerRun?: number
}

export type DispatchResult = {
  eventsProcessed: number
  sent: number
  failed: number
  skippedConcurrent?: boolean
  timedOut?: boolean
  maxSendsReached?: boolean
}

function preferenceWhere(type: NotificationType) {
  if (type === 'WORK_PUBLISHED') return { notifyWork: true }
  if (type === 'INSIGHT_PUBLISHED') return { notifyInsights: true }
  return { notifyImportant: true }
}

export async function createNotificationEvent(input: CreateEventInput) {
  return prisma.notificationEvent.create({
    data: {
      type: input.type,
      title: input.title,
      summary: input.summary,
      url: input.url,
      entityId: input.entityId,
    },
  })
}

function buildNotificationEmail(options: {
  title: string
  summary?: string
  url: string
  unsubscribeUrl: string
  preferencesUrl: string
}) {
  return renderBrandedEmail({
    eyebrow: 'Leseb Updates',
    title: options.title,
    lead: options.summary,
    ctaLabel: 'View update',
    ctaUrl: options.url,
    preferencesUrl: options.preferencesUrl,
    unsubscribeUrl: options.unsubscribeUrl,
  })
}

function toAbsoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url
  const base = appBaseUrl().replace(/\/+$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

function persistErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error)
  return raw.length > DELIVERY_ERROR_MAX_LEN ? raw.slice(0, DELIVERY_ERROR_MAX_LEN) : raw
}

async function ensureNotificationSystemState() {
  await prisma.notificationSystemState.upsert({
    where: { id: 'default' },
    create: { id: 'default' },
    update: {},
  })
}

/**
 * Processes pending notification events with:
 * - Cross-instance lock (lease-based) to avoid duplicate concurrent dispatch
 * - Wall-clock budget (exit early, remain retryable)
 * - Cap on outbound send attempts per run (queue cannot blast unlimited sends)
 * - Persisted last error + lastAttemptAt on each failed delivery (NotificationDelivery)
 */
export async function dispatchPendingNotifications(
  options: DispatchOptions = {},
): Promise<DispatchResult> {
  const maxMs = options.maxMs ?? DISPATCH_DEFAULT_MAX_MS
  const maxSendsPerRun = options.maxSendsPerRun ?? DISPATCH_DEFAULT_MAX_SENDS_PER_RUN
  const maxEventsPerRun = options.maxEventsPerRun ?? DISPATCH_DEFAULT_MAX_EVENTS_PER_RUN

  console.info('[notifications] dispatch start', { maxMs, maxSendsPerRun, maxEventsPerRun })

  await ensureNotificationSystemState()

  const leaseUntil = new Date(Date.now() + DISPATCH_LOCK_LEASE_MS)
  const lockResult = await prisma.notificationSystemState.updateMany({
    where: {
      id: 'default',
      OR: [{ dispatchLockedUntil: null }, { dispatchLockedUntil: { lte: new Date() } }],
    },
    data: { dispatchLockedUntil: leaseUntil },
  })

  if (lockResult.count === 0) {
    console.warn('[notifications] dispatch skipped: another run holds the lock')
    return {
      eventsProcessed: 0,
      sent: 0,
      failed: 0,
      skippedConcurrent: true,
    }
  }

  const deadline = Date.now() + maxMs
  let stopReason: 'timeout' | 'max_sends' | null = null
  let sendAttemptsThisRun = 0

  let sent = 0
  let failed = 0
  let eventsProcessed = 0

  const persistRunSummary = async () => {
    const summary = {
      sent,
      failed,
      eventsProcessed,
      sendAttempts: sendAttemptsThisRun,
      timedOut: stopReason === 'timeout',
      maxSendsReached: stopReason === 'max_sends',
      maxMs,
      maxSendsPerRun,
      maxEventsPerRun,
      finishedAt: new Date().toISOString(),
    }
    await prisma.notificationSystemState.update({
      where: { id: 'default' },
      data: {
        dispatchLockedUntil: null,
        lastDispatchAt: new Date(),
        lastDispatchSummary: summary,
      },
    })
  }

  try {
    const events = await prisma.notificationEvent.findMany({
      where: { dispatchedAt: null },
      orderBy: { createdAt: 'asc' },
      take: maxEventsPerRun,
    })

    eventsProcessed = events.length
    console.info(`[notifications] dispatch loaded ${events.length} pending event(s) (batch cap ${maxEventsPerRun})`)

    const now = new Date()

    eventLoop: for (const event of events) {
      if (Date.now() > deadline) {
        stopReason = 'timeout'
        console.warn('[notifications] dispatch stopping: wall-clock budget exceeded')
        break
      }

      let batchSent = 0
      let batchFailed = 0

      const subscribers = await prisma.subscriber.findMany({
        where: {
          status: SubscriberStatus.ACTIVE,
          ...preferenceWhere(event.type),
        },
        orderBy: { createdAt: 'asc' },
      })
      const deliveries = await prisma.notificationDelivery.findMany({
        where: { eventId: event.id },
      })
      const deliveryBySubscriber = new Map(deliveries.map((d) => [d.subscriberId, d]))
      let eventHasRemainingRetries = false

      for (const subscriber of subscribers) {
        if (Date.now() > deadline) {
          stopReason = 'timeout'
          console.warn('[notifications] dispatch stopping mid-event: wall-clock budget exceeded')
          break eventLoop
        }
        if (sendAttemptsThisRun >= maxSendsPerRun) {
          stopReason = 'max_sends'
          console.warn(
            `[notifications] dispatch stopping: max send attempts per run reached (${maxSendsPerRun})`,
          )
          break eventLoop
        }

        const existing = deliveryBySubscriber.get(subscriber.id)
        if (existing?.status === DeliveryStatus.SENT) continue
        if (existing?.status === DeliveryStatus.FAILED && existing.retryCount >= NOTIFICATION_MAX_RETRY) continue
        if (existing && existing.nextAttemptAt > now) {
          eventHasRemainingRetries = true
          continue
        }

        const rawUnsub = signUnsubscribeToken(subscriber.id)
        const unsubscribeUrl = `${appBaseUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(rawUnsub)}`
        const rawPrefs = signPreferencesToken(subscriber.id)
        const preferencesUrl = `${appBaseUrl()}/newsletter/preferences?token=${encodeURIComponent(rawPrefs)}`
        const email = buildNotificationEmail({
          title: event.title,
          summary: event.summary ?? undefined,
          url: toAbsoluteUrl(event.url),
          unsubscribeUrl,
          preferencesUrl,
        })

        sendAttemptsThisRun += 1

        try {
          await sendMail({
            to: subscriber.email,
            subject: event.title,
            html: email.html,
            text: email.text,
          })
          sent += 1
          batchSent += 1
          await prisma.notificationDelivery.upsert({
            where: {
              eventId_subscriberId: {
                eventId: event.id,
                subscriberId: subscriber.id,
              },
            },
            create: {
              eventId: event.id,
              subscriberId: subscriber.id,
              status: DeliveryStatus.SENT,
              retryCount: existing?.retryCount ?? 0,
              nextAttemptAt: now,
              lastAttemptAt: now,
              sentAt: new Date(),
            },
            update: {
              status: DeliveryStatus.SENT,
              sentAt: new Date(),
              nextAttemptAt: now,
              lastAttemptAt: now,
              error: null,
            },
          })
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: { lastNotifiedAt: new Date() },
          })
        } catch (error) {
          failed += 1
          batchFailed += 1
          const errMsg = persistErrorMessage(error)
          const nextRetryCount = (existing?.retryCount ?? 0) + 1
          const backoffMinutes = Math.min(2 ** (nextRetryCount - 1), 60)
          const nextAttemptAt = new Date(Date.now() + backoffMinutes * 60_000)
          if (nextRetryCount < NOTIFICATION_MAX_RETRY) eventHasRemainingRetries = true
          await prisma.notificationDelivery.upsert({
            where: {
              eventId_subscriberId: {
                eventId: event.id,
                subscriberId: subscriber.id,
              },
            },
            create: {
              eventId: event.id,
              subscriberId: subscriber.id,
              status: DeliveryStatus.FAILED,
              retryCount: nextRetryCount,
              nextAttemptAt,
              lastAttemptAt: now,
              error: errMsg,
            },
            update: {
              status: DeliveryStatus.FAILED,
              retryCount: nextRetryCount,
              nextAttemptAt,
              lastAttemptAt: now,
              error: errMsg,
            },
          })
        }
      }

      if (stopReason) break

      if (!eventHasRemainingRetries) {
        await prisma.notificationEvent.update({
          where: { id: event.id },
          data: { dispatchedAt: new Date() },
        })
        console.info(
          `[notifications] event ${event.id} completed (${batchSent} sent this batch, ${subscribers.length} recipients)`,
        )
      } else if (batchFailed > 0) {
        console.warn(
          `[notifications] event ${event.id} batch had ${batchFailed} failure(s), ${batchSent} sent; event stays pending for retry`,
        )
      } else {
        console.info(
          `[notifications] event ${event.id} deferred (backoff); ${subscribers.length} recipient(s)`,
        )
      }
    }

    if (stopReason === 'timeout') {
      console.warn('[notifications] dispatch exited early due to timeout — remaining work stays queued')
    }
    if (stopReason === 'max_sends') {
      console.warn(
        '[notifications] dispatch exited early due to send cap — remaining work stays queued for next run',
      )
    }

    console.info('[notifications] dispatch end', {
      eventsProcessed,
      sent,
      failed,
      sendAttemptsThisRun,
      timedOut: stopReason === 'timeout',
      maxSendsReached: stopReason === 'max_sends',
    })

    return {
      eventsProcessed,
      sent,
      failed,
      timedOut: stopReason === 'timeout',
      maxSendsReached: stopReason === 'max_sends',
    }
  } catch (error) {
    console.error('[notifications] dispatch failed before summary persist', error)
    throw error
  } finally {
    try {
      await persistRunSummary()
    } catch (e) {
      console.error('[notifications] failed to persist dispatch summary / release lock', e)
      await prisma.notificationSystemState
        .update({
          where: { id: 'default' },
          data: { dispatchLockedUntil: null },
        })
        .catch(() => {})
    }
  }
}
