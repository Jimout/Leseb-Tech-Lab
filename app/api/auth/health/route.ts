import { NextResponse } from 'next/server'

import {
  ensureNextAuthRuntimeEnv,
  getAuthConfigChecks,
  isAuthConfiguredForProduction,
} from '@/lib/auth-env'
import { getAdminCredentialsFromEnv } from '@/lib/admin/bootstrap-admin-user'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

/** Public checklist — booleans only, no secret values. */
export async function GET() {
  ensureNextAuthRuntimeEnv()
  const checks = getAuthConfigChecks()

  let databaseReachable = false
  let adminUserExists = false
  const envAdmin = getAdminCredentialsFromEnv()

  try {
    await prisma.$queryRaw`SELECT 1`
    databaseReachable = true
    if (envAdmin) {
      const user = await prisma.user.findUnique({
        where: { email: envAdmin.email },
        select: { id: true, password: true },
      })
      adminUserExists = Boolean(user?.password)
    }
  } catch (error) {
    console.error('[auth/health] database check failed:', error)
  }

  const ok =
    isAuthConfiguredForProduction() && databaseReachable && (!envAdmin || adminUserExists)

  return NextResponse.json({
    ok,
    checks: [
      ...checks.map((c) => ({ id: c.id, label: c.label, ok: c.ok })),
      { id: 'databaseReachable', label: 'Database connection', ok: databaseReachable },
      {
        id: 'adminUser',
        label: envAdmin
          ? `Admin user (${envAdmin.email}) in database`
          : 'ADMIN_EMAIL and ADMIN_PASSWORD set',
        ok: envAdmin ? adminUserExists : false,
      },
    ],
    hint: ok
      ? 'Auth looks ready. Sign in with your Vercel ADMIN_EMAIL and ADMIN_PASSWORD.'
      : 'Fix failed checks, redeploy, or run npm run admin:seed locally with the same DATABASE_URL.',
  })
}
