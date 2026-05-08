import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { requireAdminAccess } from '@/lib/admin-api-auth'
import type { WorkRow } from '@/lib/work-admin-types'
import {
  deleteWorkRowByIdFromDb,
  getWorkRowByIdFromDb,
  updateWorkRowByIdInDb,
} from '@/lib/work-rows-db'

export const runtime = 'nodejs'

const workRowPartialSchema = z.object({
  slug: z.string().trim().optional(),
  heroMedia: z.unknown().nullable().optional(),
  mediaAssets: z.array(z.unknown()).optional(),
  year: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  filterIds: z.array(z.string()).optional(),
  detail: z.unknown().optional(),
})

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  const { id } = await ctx.params
  try {
    const row = await getWorkRowByIdFromDb(id)
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ row })
  } catch (error) {
    console.error('GET /api/admin/work-rows/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to load work row' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = workRowPartialSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const existing = await getWorkRowByIdFromDb(id)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const merged: WorkRow = {
      ...existing,
      ...(parsed.data as Partial<WorkRow>),
      detail:
        parsed.data.detail !== undefined
          ? (parsed.data.detail as WorkRow['detail'])
          : existing.detail,
      filterIds:
        parsed.data.filterIds !== undefined ? [...parsed.data.filterIds] : [...existing.filterIds],
      id,
      slug: parsed.data.slug ?? existing.slug,
    }

    const updated = await updateWorkRowByIdInDb(id, merged)
    if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    return NextResponse.json({ row: updated })
  } catch (error) {
    console.error('PATCH /api/admin/work-rows/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update work row' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  const { id } = await ctx.params
  try {
    const ok = await deleteWorkRowByIdFromDb(id)
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/work-rows/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete work row' }, { status: 500 })
  }
}
