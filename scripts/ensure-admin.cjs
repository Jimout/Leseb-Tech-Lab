const bcrypt = require('bcrypt')
const { spawnSync } = require('node:child_process')

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@leseb.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME = process.env.ADMIN_NAME || 'Leseb Admin'

async function main() {
  const email = ADMIN_EMAIL.trim().toLowerCase()
  if (!email) {
    throw new Error('ADMIN_EMAIL is empty.')
  }
  if (!ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is empty.')
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  const esc = (value) => value.replace(/'/g, "''")

  const sql = `
INSERT INTO "User" ("id", "email", "name", "password", "createdAt")
VALUES ('admin-user', '${esc(email)}', '${esc(ADMIN_NAME)}', '${esc(passwordHash)}', NOW())
ON CONFLICT ("email") DO UPDATE
SET "name" = EXCLUDED."name", "password" = EXCLUDED."password";
`.trim()

  const result = spawnSync(
    'npx prisma db execute --stdin --schema prisma/schema.prisma',
    [],
    {
      input: sql,
      shell: true,
      stdio: ['pipe', 'inherit', 'inherit'],
    },
  )

  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error(`prisma db execute failed with exit code ${result.status}`)
  }

  console.log(`Admin user ready: ${email}`)
}

main()
  .catch((error) => {
    console.error('Failed to ensure admin user.')
    console.error(error)
    process.exitCode = 1
  })
