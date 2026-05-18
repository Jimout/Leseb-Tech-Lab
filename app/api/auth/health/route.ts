import { NextResponse } from 'next/server'

import {
  ensureNextAuthRuntimeEnv,
  getAuthConfigChecks,
  isAuthConfiguredForProduction,
} from '@/lib/auth-env'

export const runtime = 'nodejs'

/** Public checklist — booleans only, no secret values. Use after setting Vercel env vars. */
export function GET() {
  ensureNextAuthRuntimeEnv()
  const checks = getAuthConfigChecks()
  return NextResponse.json({
    ok: isAuthConfiguredForProduction(),
    checks: checks.map((c) => ({ id: c.id, label: c.label, ok: c.ok })),
    hint: 'Set missing variables in Vercel (Production), then redeploy.',
  })
}
