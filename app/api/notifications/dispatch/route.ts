import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'
import {
  DISPATCH_DEFAULT_MAX_EVENTS_PER_RUN,
  DISPATCH_DEFAULT_MAX_MS,
  DISPATCH_DEFAULT_MAX_SENDS_PER_RUN,
} from '@/lib/notifications/constants'
import { dispatchPendingNotifications } from '@/lib/notifications/service'

export const runtime = 'nodejs'
export const maxDuration = 300

function hasValidSecret(request: NextRequest) {
  const manualSecret = process.env.DISPATCH_SECRET
  const headerSecret = request.headers.get('x-dispatch-secret')
  if (manualSecret && headerSecret === manualSecret) return true

  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (!cronSecret || !authHeader) return false
  return authHeader === `Bearer ${cronSecret}`
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const allowedBySession = !!session?.user && isAllowedAdminSession(session)
  if (!allowedBySession && !hasValidSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const maxMs = (() => {
    const n = Number(process.env.DISPATCH_MAX_MS)
    return Number.isFinite(n) && n > 0 ? n : DISPATCH_DEFAULT_MAX_MS
  })()
  const maxSendsPerRun = (() => {
    const n = Number(process.env.DISPATCH_MAX_SENDS_PER_RUN)
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : DISPATCH_DEFAULT_MAX_SENDS_PER_RUN
  })()
  const maxEventsPerRun = (() => {
    const n = Number(process.env.DISPATCH_MAX_EVENTS_PER_RUN)
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : DISPATCH_DEFAULT_MAX_EVENTS_PER_RUN
  })()

  try {
    const result = await dispatchPendingNotifications({
      maxMs,
      maxSendsPerRun,
      maxEventsPerRun,
    })
    return NextResponse.json({ ok: true, ...result }, { status: 200 })
  } catch (error) {
    console.error('POST /api/notifications/dispatch', error)
    return NextResponse.json({ error: 'Dispatch failed' }, { status: 500 })
  }
}
