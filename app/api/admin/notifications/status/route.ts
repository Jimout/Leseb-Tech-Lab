//app/api/admin/notifications/status/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'
import { DeliveryStatus } from '@/lib/generated/prisma/client'
import { NOTIFICATION_MAX_RETRY } from '@/lib/notifications/constants'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAllowedAdminSession(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [pendingEvents, failedDeliveries, failedRetryable, systemState, recentSample] = await Promise.all([
    prisma.notificationEvent.count({ where: { dispatchedAt: null } }),
    prisma.notificationDelivery.count({ where: { status: DeliveryStatus.FAILED } }),
    prisma.notificationDelivery.count({
      where: {
        status: DeliveryStatus.FAILED,
        retryCount: { lt: NOTIFICATION_MAX_RETRY },
      },
    }),
    prisma.notificationSystemState.findUnique({ where: { id: 'default' } }),
    prisma.notificationDelivery.findMany({
      where: { status: DeliveryStatus.FAILED, error: { not: null } },
      take: 5,
      orderBy: { lastAttemptAt: 'desc' },
      select: {
        id: true,
        lastAttemptAt: true,
        error: true,
        retryCount: true,
        eventId: true,
        subscriber: { select: { email: true } },
      },
    }),
  ])

  return NextResponse.json({
    pendingEvents,
    failedDeliveries,
    failedRetryable,
    lastDispatchAt: systemState?.lastDispatchAt?.toISOString() ?? null,
    lastDispatchSummary: systemState?.lastDispatchSummary ?? null,
    recentFailedSample: recentSample.map((d) => ({
      id: d.id,
      lastAttemptAt: d.lastAttemptAt?.toISOString() ?? null,
      lastError: d.error,
      retryCount: d.retryCount,
      eventId: d.eventId,
      subscriberEmail: d.subscriber.email,
    })),
  })
}
