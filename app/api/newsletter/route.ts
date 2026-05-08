import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { appBaseUrl, MailProviderNotConfiguredError, sendMail } from '@/lib/mailer'
import { renderBrandedEmail } from '@/lib/emails/templates'
import { createRawToken, hashToken } from '@/lib/newsletter-tokens'
import { SubscriberStatus } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'

const newsletterSchema = z.object({
  email: z.string().email(),
  notifyWork: z.boolean().optional().default(true),
  notifyInsights: z.boolean().optional().default(true),
  notifyImportant: z.boolean().optional().default(true),
})

export const runtime = 'nodejs'

const SUBSCRIBE_WINDOW_MS = 60_000
const SUBSCRIBE_MAX_PER_WINDOW = 6
const subscribeRate = new Map<string, number[]>()

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

function isRateLimited(key: string) {
  const now = Date.now()
  const recent = (subscribeRate.get(key) ?? []).filter((t) => now - t <= SUBSCRIBE_WINDOW_MS)
  if (recent.length >= SUBSCRIBE_MAX_PER_WINDOW) {
    subscribeRate.set(key, recent)
    return true
  }
  recent.push(now)
  subscribeRate.set(key, recent)
  return false
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = newsletterSchema.parse(body)
    const email = parsed.email.trim().toLowerCase()
    const rateKey = `${getClientIp(request)}:${email}`
    if (isRateLimited(rateKey)) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }
    const rawConfirmToken = createRawToken()
    const confirmTokenHash = hashToken(rawConfirmToken)

    const existing = await prisma.subscriber.findUnique({ where: { email } })
    if (!existing) {
      await prisma.subscriber.create({
        data: {
          email,
          status: SubscriberStatus.PENDING,
          confirmTokenHash,
          notifyWork: parsed.notifyWork,
          notifyInsights: parsed.notifyInsights,
          notifyImportant: parsed.notifyImportant,
        },
      })
    } else {
      await prisma.subscriber.update({
        where: { email },
        data: {
          status: existing.status === SubscriberStatus.ACTIVE ? SubscriberStatus.ACTIVE : SubscriberStatus.PENDING,
          confirmTokenHash,
          notifyWork: parsed.notifyWork,
          notifyInsights: parsed.notifyInsights,
          notifyImportant: parsed.notifyImportant,
          unsubscribedAt: null,
        },
      })
    }

    const confirmUrl = `${appBaseUrl()}/api/newsletter/confirm?token=${encodeURIComponent(rawConfirmToken)}`
    const emailTemplate = renderBrandedEmail({
      eyebrow: 'Nattyopia Updates',
      title: 'Confirm your subscription',
      lead: 'Please confirm your email to start receiving new work and insights updates.',
      ctaLabel: 'Confirm subscription',
      ctaUrl: confirmUrl,
    })
    await sendMail({
      to: email,
      subject: 'Confirm your subscription',
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    return NextResponse.json({ success: true, message: 'Please confirm from your inbox.' }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email', details: error.errors },
        { status: 400 }
      )
    }
    if (error instanceof MailProviderNotConfiguredError) {
      return NextResponse.json(
        { error: 'Email service unavailable. Please try again later.' },
        { status: 503 },
      )
    }

    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
