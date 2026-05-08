import { NextResponse } from 'next/server'

import { getWorkRowsFromDb } from '@/lib/work-rows-db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const rows = await getWorkRowsFromDb()
    return NextResponse.json({ rows })
  } catch (error) {
    console.error('GET /api/work-rows failed:', error)
    return NextResponse.json({ error: 'Failed to load work rows' }, { status: 500 })
  }
}

