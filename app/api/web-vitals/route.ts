import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import type { WebVitalsIngestRow } from '@/lib/rum/web-vitals-types'

export const runtime = 'nodejs'

const ingestSchema = z.object({
  schemaVersion: z.literal(1),
  path: z.string().min(1).max(2048),
  metricName: z.enum(['LCP', 'CLS', 'INP', 'FCP', 'TTFB']),
  value: z.number().finite(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  metricId: z.string().min(1).max(200),
  navigationType: z.string().max(32).optional(),
  delta: z.number().finite().optional(),
  device: z
    .object({
      deviceClass: z.enum(['mobile', 'tablet', 'desktop']),
      coarsePointer: z.boolean(),
      viewportWidth: z.number().int().min(0).max(16384),
      viewportHeight: z.number().int().min(0).max(16384),
      dpr: z.number().min(0.25).max(8).optional(),
      effectiveConnectionType: z.enum(['slow-2g', '2g', '3g', '4g']).optional(),
    })
    .optional(),
  clientTs: z.string().max(64).optional(),
})

/** Max JSON body size (bytes) — keep tiny for edge safety. */
const MAX_BODY = 8192

/**
 * POST /api/web-vitals
 *
 * Persists as structured logs today; shape matches a future table, e.g.
 *   (received_at, path, metric_name, value, rating, metric_id, navigation_type, delta, device_class, ...)
 */
export async function POST(req: NextRequest) {
  const len = Number(req.headers.get('content-length') ?? '0')
  if (len > MAX_BODY) {
    return NextResponse.json({ ok: false, error: 'payload too large' }, { status: 413 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const parsed = ingestSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'validation failed' }, { status: 422 })
  }

  const receivedAt = new Date().toISOString()
  const row: WebVitalsIngestRow = {
    ...parsed.data,
    receivedAt,
  }

  // Single-line JSON for log drains (Vercel, Datadog, etc.) and later ETL.
  console.info(`[web-vitals] ${JSON.stringify(row)}`)

  return new NextResponse(null, { status: 204 })
}
