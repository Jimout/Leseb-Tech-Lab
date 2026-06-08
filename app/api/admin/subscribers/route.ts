//app/api/admin/subscribers/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { SubscriberStatus } from '@/lib/generated/prisma/client'
import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'
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

  const rows = await prisma.subscriber.findMany({
    where: { status: { not: SubscriberStatus.UNSUBSCRIBED } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      status: true,
      createdAt: true,
      confirmedAt: true,
      notifyWork: true,
      notifyInsights: true,
      notifyImportant: true,
    },
  })
  return NextResponse.json({ rows })
}
