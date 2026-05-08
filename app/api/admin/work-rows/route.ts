import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { requireAdminAccess } from '@/lib/admin-api-auth'
import type { WorkRow } from '@/lib/work-admin-types'
import { createWorkRowInDb, getWorkRowsFromDb, saveWorkRowsToDb } from '@/lib/work-rows-db'

export const runtime = 'nodejs'

const workRowSchema = z.object({
  id: z.string().trim().optional().default(''),
  publicId: z.string().trim().optional().default(''),
  slug: z.string().trim().optional(),
  heroMedia: z.unknown().nullable().optional(),
  mediaAssets: z.array(z.unknown()).optional(),
  year: z.string(),
  location: z.string(),
  title: z.string(),
  category: z.string(),
  filterIds: z.array(z.string()),
  detail: z.unknown().optional(),
})

const workRowsPayloadSchema = z.object({
  rows: z.array(workRowSchema),
})

export async function GET(request: NextRequest) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  try {
    const rows = await getWorkRowsFromDb()
    return NextResponse.json({ rows })
  } catch (error) {
    console.error('GET /api/admin/work-rows failed:', error)
    return NextResponse.json({ error: 'Failed to load work rows' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = workRowSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const created = await createWorkRowInDb(parsed.data as WorkRow)
    if (!created) return NextResponse.json({ error: 'Failed to create work row' }, { status: 500 })
    return NextResponse.json({ row: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/work-rows failed:', error)
    return NextResponse.json({ error: 'Failed to create work row' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = workRowsPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const saved = await saveWorkRowsToDb(parsed.data.rows as WorkRow[])
    return NextResponse.json({ rows: saved })
  } catch (error) {
    console.error('PUT /api/admin/work-rows failed:', error)
    return NextResponse.json({ error: 'Failed to save work rows' }, { status: 500 })
  }
}

