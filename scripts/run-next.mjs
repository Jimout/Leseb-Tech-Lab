/**
 * Run Next.js from the canonical project directory (fixes Windows path casing:
 * `nattyopia` vs `Nattyopia` duplicates the App Router and breaks dev).
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = fs.realpathSync.native(path.resolve(scriptDir, '..'))
const rawArgs = process.argv.slice(2)
const clean = rawArgs.includes('--clean')
const nextArgs = rawArgs.filter((a) => a !== '--clean')

if (nextArgs.length === 0) {
  console.error('Usage: node scripts/run-next.mjs <next-command> [args...] [--clean]')
  process.exit(1)
}

const cwd = process.cwd()
if (process.platform === 'win32' && path.resolve(cwd).toLowerCase() !== path.resolve(projectRoot).toLowerCase()) {
  console.warn(
    `[run-next] Shell cwd differs from project root — Next will run in:\n  ${projectRoot}\n`,
  )
} else if (cwd !== projectRoot) {
  console.warn(`[run-next] Using canonical project root:\n  ${projectRoot}\n`)
}

if (clean && nextArgs[0] === 'dev') {
  const nextDir = path.join(projectRoot, '.next')
  fs.rmSync(nextDir, { recursive: true, force: true })
  console.log('[run-next] Cleared .next for a fresh dev build.')
}

const child = spawn('npx', ['next', ...nextArgs], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_PROJECT_DIR: projectRoot,
    PWD: projectRoot,
  },
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
