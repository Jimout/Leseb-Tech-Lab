import { NextResponse } from 'next/server'

import {
  DEFAULT_ADMIN_EMAIL,
  countUsersWithPassword,
  userHasPassword,
} from '@/lib/admin/user-auth'
import {
  ensureNextAuthRuntimeEnv,
  getAuthConfigChecks,
  isAuthConfiguredForProduction,
} from '@/lib/auth-env'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

/** Public checklist — booleans only, no secret values. */
export async function GET() {
  ensureNextAuthRuntimeEnv()
  const checks = getAuthConfigChecks()

  let databaseReachable = false
  let defaultAdminExists = false
  let usersWithPassword = 0

  try {
    await prisma.$queryRaw`SELECT 1`
    databaseReachable = true
    defaultAdminExists = await userHasPassword(DEFAULT_ADMIN_EMAIL)
    usersWithPassword = await countUsersWithPassword()
  } catch (error) {
    console.error('[auth/health] database check failed:', error)
  }

  const ok =
    isAuthConfiguredForProduction() &&
    databaseReachable &&
    defaultAdminExists

  const hints: string[] = []
  if (!databaseReachable) {
    hints.push(
      'DATABASE_URL is set but connection failed. Copy the exact URL from Neon, remove channel_binding if present, redeploy.',
    )
  }
  if (databaseReachable && !defaultAdminExists) {
    hints.push(
      `No admin user for ${DEFAULT_ADMIN_EMAIL}. Run npm run admin:seed (same DATABASE_URL as production) or redeploy after migrate.`,
    )
  }
  if (ok) {
    hints.push(`Sign in with your database credentials (default seed: ${DEFAULT_ADMIN_EMAIL}).`)
  }

  return NextResponse.json({
    ok,
    checks: [
      ...checks.map((c) => ({ id: c.id, label: c.label, ok: c.ok })),
      { id: 'databaseReachable', label: 'Database connection from server', ok: databaseReachable },
      {
        id: 'defaultAdmin',
        label: `Default admin (${DEFAULT_ADMIN_EMAIL}) in database`,
        ok: defaultAdminExists,
      },
      {
        id: 'usersWithPassword',
        label: 'Users with password in database',
        ok: usersWithPassword > 0,
        count: usersWithPassword,
      },
    ],
    hint: hints.join(' '),
  })
}
