import { NextResponse, type NextRequest } from 'next/server'

import { userHasPassword } from '@/lib/admin/user-auth'
import { verifyAndDecodeSessionHeader } from '@/lib/session-header-server'

export async function requireAdminAccess(request: NextRequest): Promise<NextResponse | null> {
  const sessionHeader = request.headers.get('x-session')
  if (!sessionHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyAndDecodeSessionHeader(sessionHeader)
  const sessionEmail = payload?.user?.email?.trim().toLowerCase()
  if (!sessionEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const allowed = await userHasPassword(sessionEmail)
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } catch (error) {
    console.error('[auth] requireAdminAccess failed:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
