//api/visits/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import {
  checkVisitRateLimit,
  getClientIp,
  hashVisitIp,
  newVisitId,
  normalizeVisitPath,
} from '@/lib/visits/server'

export const runtime = 'nodejs'

const bodySchema = z.object({
  path: z.string(),
})

function clampText(value: string | null, max: number) {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

export async function POST(req: NextRequest) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const path = normalizeVisitPath(parsed.data.path)
  if (!path) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  if (path.startsWith('/admin') || path.startsWith('/leseb-admin') || path.startsWith('/api')) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const ip = getClientIp(req)
  const ipHash = hashVisitIp(ip)
  const rateKey = ipHash ?? ip ?? 'anon'
  if (!checkVisitRateLimit(`visit:${rateKey}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const referrer = clampText(req.headers.get('referer'), 500)
  const userAgent = clampText(req.headers.get('user-agent'), 500)

  await prisma.pageVisit.create({
    data: {
      id: newVisitId(),
      path,
      referrer,
      userAgent,
      ipHash,
    },
    select: { id: true },
  })

  return NextResponse.json({ ok: true })
}
