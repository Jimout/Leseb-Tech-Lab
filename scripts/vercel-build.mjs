/** Production build (frontend-only). */
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

console.log('[build] Running Next.js build (frontend-only)…')
run('node', ['scripts/run-next.mjs', 'build', '--webpack'])
