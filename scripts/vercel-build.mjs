/**
 * Vercel production build: apply migrations, seed admin from env, then next build.
 */
import { spawnSync } from 'node:child_process'

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (process.env.DATABASE_URL?.trim()) {
  console.log('[vercel-build] Applying Prisma migrations…')
  run('npx', ['prisma', 'migrate', 'deploy'])

  if (process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD?.trim()) {
    console.log('[vercel-build] Ensuring admin user…')
    run('npx', ['tsx', 'scripts/ensure-admin.ts'])
  } else {
    console.warn('[vercel-build] Skipping admin seed — ADMIN_EMAIL or ADMIN_PASSWORD not set.')
  }
} else {
  console.warn('[vercel-build] DATABASE_URL not set — skipping migrate and admin seed.')
}

console.log('[vercel-build] Running Next.js build…')
run('node', ['scripts/run-next.mjs', 'build', '--webpack'])
