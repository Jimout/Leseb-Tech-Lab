// app/api/admin/visits/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'

import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

function rangeStartDate(range: string | null): Date | null {
  if (range === 'today') {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    return startOfToday
  }
  if (range === '7d') return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  if (range === '30d') return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return null
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAllowedAdminSession(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const rawLimit = Number(searchParams.get('limit') ?? '1000')
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), 5000) : 1000
  const range = searchParams.get('range')
  const from = rangeStartDate(range)

  const rows = await prisma.pageVisit.findMany({
    where: from ? { createdAt: { gte: from } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      path: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    rows: rows.map((r) => ({
      id: r.id,
      path: r.path,
      createdAtIso: r.createdAt.toISOString(),
    })),
  })
}
