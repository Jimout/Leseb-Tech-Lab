/**
 * Create or update the admin User row from ADMIN_EMAIL / ADMIN_PASSWORD.
 * Run locally: npm run admin:seed
 * Also runs during Vercel build after prisma migrate deploy.
 */
import 'dotenv/config'

import bcrypt from 'bcrypt'

import { PrismaClient } from '../lib/generated/prisma/client'

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@leseb.com').trim().toLowerCase()
  const password = (process.env.ADMIN_PASSWORD || 'admin123').trim()
  const name = (process.env.ADMIN_NAME || 'Leseb Admin').trim()

  if (!email) throw new Error('ADMIN_EMAIL is empty.')
  if (!password) throw new Error('ADMIN_PASSWORD is empty.')
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is not set.')
  }

  const prisma = new PrismaClient()
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        id: 'admin-user',
        email,
        name,
        password: passwordHash,
      },
      update: {
        name,
        password: passwordHash,
      },
      select: { id: true, email: true },
    })
    console.log(`Admin user ready: ${user.email}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('Failed to ensure admin user.')
  console.error(error)
  process.exit(1)
})
