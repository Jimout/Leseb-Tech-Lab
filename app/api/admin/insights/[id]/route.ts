import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { requireAdminAccess } from '@/lib/admin-api-auth'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import type { InsightArticle } from '@/lib/insight-types'
import {
  deleteInsightByIdFromDb,
  getInsightByIdFromDb,
  updateInsightByIdInDb,
} from '@/lib/insights-db'

export const runtime = 'nodejs'

const insightPartialSchema = z.object({
  slug: z.string().trim().optional(),
  date: z.string().optional(),
  dateIso: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  heroMedia: z.unknown().nullable().optional(),
  mediaAssets: z.array(z.unknown()).optional(),
  href: z.string().optional(),
  filterIds: z.array(z.string()).optional(),
  bodyMode: z.enum(['simple', 'structured']).optional(),
  simpleBodyHtml: z.string().optional(),
  article: z.unknown().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  const { id } = await params
  try {
    const insight = await getInsightByIdFromDb(id)
    if (!insight) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ insight })
  } catch (error) {
    console.error('GET /api/admin/insights/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to load insight' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  const { id } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = insightPartialSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const existing = await getInsightByIdFromDb(id)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const merged: ShowcaseInsight = {
      ...existing,
      ...(parsed.data as Partial<ShowcaseInsight>),
      article:
        parsed.data.article !== undefined
          ? (parsed.data.article as InsightArticle)
          : existing.article,
      filterIds:
        parsed.data.filterIds !== undefined ? [...parsed.data.filterIds] : [...existing.filterIds],
      id,
      slug: parsed.data.slug ?? existing.slug,
      href: parsed.data.href ?? existing.href,
    }

    const updated = await updateInsightByIdInDb(id, merged)
    if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    return NextResponse.json({ insight: updated })
  } catch (error) {
    console.error('PATCH /api/admin/insights/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  const { id } = await params
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }
  
  try {
    const deleted = await deleteInsightByIdFromDb(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'Insight deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/admin/insights/[id] failed:', error)
    return NextResponse.json({ 
      error: 'Failed to delete insight',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}