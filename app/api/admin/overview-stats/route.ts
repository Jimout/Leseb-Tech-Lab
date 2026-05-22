import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { SubscriberStatus } from '@/lib/generated/prisma/client'
import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAllowedAdminSession(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const since = new Date(Date.now() - SEVEN_DAYS_MS)

  const [insightsCount, workCount, subscribers, visits] = await Promise.all([
    prisma.insight.count(),
    prisma.work.count(),
    prisma.subscriber.findMany({
      where: { status: { not: SubscriberStatus.UNSUBSCRIBED } },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pageVisit.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return NextResponse.json({
    insightsCount,
    workCount,
    subscribers: subscribers.map((row) => ({ createdAt: row.createdAt.toISOString() })),
    visits: visits.map((row) => ({ createdAtIso: row.createdAt.toISOString() })),
  })
}
