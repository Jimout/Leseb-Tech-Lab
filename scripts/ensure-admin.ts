/**
 * Create or update the default admin user in the database.
 * Run locally: npm run admin:seed
 * Also runs during Vercel build after prisma migrate deploy.
 */
import 'dotenv/config'

import {
  DEFAULT_ADMIN_EMAIL,
  ensureDefaultAdminUser,
} from '../lib/admin/user-auth'

/** Initial password for seed only — change after first login in admin settings. */
const DEFAULT_SEED_PASSWORD = 'admin123'

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is not set.')
  }

  const user = await ensureDefaultAdminUser(DEFAULT_SEED_PASSWORD)
  console.log(`Admin user ready: ${user.email} (${DEFAULT_ADMIN_EMAIL})`)
}

main().catch((error) => {
  console.error('Failed to ensure admin user.')
  console.error(error)
  process.exit(1)
})
