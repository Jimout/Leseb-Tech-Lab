import { createHash, randomUUID } from 'crypto'

import type { NextRequest } from 'next/server'

const RATE_WINDOW_MS = 60_000
const RATE_MAX_PER_WINDOW = 120

type RateEntry = { windowStart: number; count: number }
const rateByKey = new Map<string, RateEntry>()

function pruneRate(now: number) {
  if (rateByKey.size < 5000) return
  for (const [k, v] of rateByKey) {
    if (now - v.windowStart > RATE_WINDOW_MS * 5) rateByKey.delete(k)
  }
}

export function checkVisitRateLimit(key: string) {
  const now = Date.now()
  pruneRate(now)
  const cur = rateByKey.get(key)
  if (!cur || now - cur.windowStart > RATE_WINDOW_MS) {
    rateByKey.set(key, { windowStart: now, count: 1 })
    return true
  }
  if (cur.count >= RATE_MAX_PER_WINDOW) return false
  cur.count += 1
  return true
}

export function normalizeVisitPath(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (trimmed.length > 2048) return null
  if (!trimmed.startsWith('/')) return null
  if (trimmed.startsWith('//')) return null
  if (trimmed.includes('\0')) return null
  return trimmed
}

export function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  return null
}

export function hashVisitIp(ip: string | null) {
  if (!ip) return null
  const pepper = process.env.VISITOR_IP_PEPPER ?? process.env.NEXTAUTH_SECRET ?? ''
  if (!pepper) return null
  return createHash('sha256').update(`${pepper}:${ip}`).digest('hex')
}

export function newVisitId() {
  return randomUUID()
}
