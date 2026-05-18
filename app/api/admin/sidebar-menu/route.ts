import { NextRequest, NextResponse } from 'next/server'

import { DEFAULT_ADMIN_NAV_GROUPS } from '@/components/admin/admin-nav-config'
import { requireAdminAccess } from '@/lib/admin-api-auth'

export async function GET(request: NextRequest) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  return NextResponse.json({ groups: DEFAULT_ADMIN_NAV_GROUPS }, { status: 200 })
}
