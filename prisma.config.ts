// This file configures Prisma CLI (migrate, generate). See prisma/schema.prisma for models.
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * `prisma generate` does not connect to the DB but Prisma still resolves the datasource URL.
 * Vercel/npm postinstall may run before env vars are applied, or DATABASE_URL may be unset in CI.
 * Use a placeholder only when missing so generate/install succeeds; runtime must set DATABASE_URL.
 */
const GENERATE_PLACEHOLDER_DATABASE_URL =
  'postgresql://postgres:postgres@127.0.0.1:5432/postgres'

if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = GENERATE_PLACEHOLDER_DATABASE_URL
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
