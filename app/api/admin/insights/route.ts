import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { requireAdminAccess } from '@/lib/admin-api-auth'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { insightHref } from '@/lib/insights-showcase-data'
import { createInsightInDb, getInsightsFromDb, saveInsightsToDb } from '@/lib/insights-db'

export const runtime = 'nodejs'

const insightSectionBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), html: z.string() }),
  z.object({ type: z.literal('ul'), items: z.array(z.string()) }),
  z.object({ type: z.literal('ol'), items: z.array(z.string()) }),
])

const insightArticleSchema = z.object({
  toc: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      heading: z.string(),
      blocks: z.array(insightSectionBlockSchema),
    }),
  ),
})

const insightRowSchema = z.object({
  id: z.string().trim().optional().default(''),
  publicId: z.string().trim().optional().default(''),
  slug: z.string().trim().optional(),
  date: z.string(),
  dateIso: z.string(),
  title: z.string(),
  description: z.string(),
  heroMedia: z.unknown().nullable().optional(),
  mediaAssets: z.array(z.unknown()).optional(),
  href: z.string().optional().default(''),
  filterIds: z.array(z.string()),
  bodyMode: z.enum(['simple', 'structured']).optional(),
  simpleBodyHtml: z.string().optional(),
  article: insightArticleSchema.optional(),
})

const insightsPayloadSchema = z.object({
  insights: z.array(insightRowSchema),
})

export async function GET(request: NextRequest) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  try {
    const insights = await getInsightsFromDb()
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('GET /api/admin/insights failed:', error)
    return NextResponse.json({ error: 'Failed to load insights' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = insightRowSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const raw = parsed.data as ShowcaseInsight
    const slug = raw.slug?.trim() || ''
    const payload: ShowcaseInsight = {
      ...raw,
      href: raw.href?.trim() || insightHref(slug || 'insight'),
    }
    const created = await createInsightInDb(payload)
    if (!created) return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 })
    return NextResponse.json({ insight: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/insights failed:', error)
    return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = insightsPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const saved = await saveInsightsToDb(parsed.data.insights as ShowcaseInsight[])
    return NextResponse.json({ insights: saved })
  } catch (error) {
    console.error('PUT /api/admin/insights failed:', error)
    return NextResponse.json({ error: 'Failed to save insights' }, { status: 500 })
  }
}
