import { NextResponse } from 'next/server'

import { getInsightsFromDb } from '@/lib/insights-db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const insights = await getInsightsFromDb()
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('GET /api/insights failed:', error)
    return NextResponse.json({ error: 'Failed to load insights' }, { status: 500 })
  }
}
