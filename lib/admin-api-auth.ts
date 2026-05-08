import { NextResponse, type NextRequest } from 'next/server'

import { verifyAndDecodeSessionHeader } from '@/lib/session-header-server'

export function requireAdminAccess(request: NextRequest): NextResponse | null {
  const sessionHeader = request.headers.get('x-session')
  if (!sessionHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyAndDecodeSessionHeader(sessionHeader)
  if (!payload?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const sessionEmail = payload.user.email.trim().toLowerCase()
  if (adminEmail && sessionEmail !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}
