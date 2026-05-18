import { NextRequest, NextResponse } from 'next/server'

import { ADMIN_LOGIN_PATH } from '@/lib/admin/admin-routes'
import { ensureNextAuthRuntimeEnv } from '@/lib/auth-env'
import { getSiteUrl } from '@/lib/seo/site-config'

export const runtime = 'nodejs'

/** Bypass NextAuth’s error page (which 500s when env is misconfigured). */
export function GET(request: NextRequest) {
  ensureNextAuthRuntimeEnv()
  const login = new URL(ADMIN_LOGIN_PATH, getSiteUrl())
  const error = request.nextUrl.searchParams.get('error')
  login.searchParams.set('error', error?.trim() || 'Configuration')
  return NextResponse.redirect(login)
}
