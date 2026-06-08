import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { isAllowedAdminSession } from '@/lib/admin-guard'
import { dispatchPendingNotifications } from '@/lib/notifications/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120 // 2 minutes

export async function POST() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (!(await isAllowedAdminSession(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  try {
    const result = await dispatchPendingNotifications()
    
    return NextResponse.json({
      eventsProcessed: result.eventsProcessed,
      sent: result.sent,
      failed: result.failed,
      skippedConcurrent: result.skippedConcurrent,
      timedOut: result.timedOut,
      maxSendsReached: result.maxSendsReached,
    })
  } catch (error) {
    console.error('POST /api/notifications/dispatch:', error)
    return NextResponse.json(
      { error: 'Dispatch failed' },
      { status: 500 }
    )
  }
}