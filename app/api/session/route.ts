import { NextRequest, NextResponse } from 'next/server'

import { verifyAndDecodeSessionHeader } from '@/lib/session-header-server'

export async function GET(request: NextRequest) {
  const sessionHeader = request.headers.get('x-session')
  if (!sessionHeader) {
    return NextResponse.json({ error: 'Missing session header' }, { status: 401 })
  }

  const payload = verifyAndDecodeSessionHeader(sessionHeader)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }

  return NextResponse.json({
    user: payload.user,
    issuedAt: payload.iat,
    expiresAt: payload.exp,
  })
}
