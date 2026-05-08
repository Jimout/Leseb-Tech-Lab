import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { normalizeStoredSiteSettings } from '@/lib/admin/site-settings'
import { authOptions } from '@/lib/auth'
import {
  getSiteSettingsFromDb,
  upsertSiteSettingsToDb,
} from '@/lib/site-settings-db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const settings = await getSiteSettingsFromDb()
    return NextResponse.json({ settings })
  } catch (e) {
    console.error('GET /api/site-settings:', e)
    return NextResponse.json(
      { error: 'Failed to load site settings' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const settings = normalizeStoredSiteSettings(body)
    await upsertSiteSettingsToDb(settings)
    return NextResponse.json({ settings })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid site settings payload',
          details: e.issues,
        },
        { status: 400 },
      )
    }
    console.error('PUT /api/site-settings:', e)
    return NextResponse.json(
      { error: 'Failed to save site settings' },
      { status: 500 },
    )
  }
}
