import bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

export function getAdminCredentialsFromEnv(): {
  email: string
  password: string
  name: string
} | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return null
  return {
    email,
    password,
    name: process.env.ADMIN_NAME?.trim() || 'Leseb Admin',
  }
}

/** Ensure the env-configured admin exists with the env password (upsert). */
export async function bootstrapAdminUserFromEnv(): Promise<{
  id: string
  email: string
  name: string | null
  password: string
} | null> {
  const creds = getAdminCredentialsFromEnv()
  if (!creds) return null

  const passwordHash = await bcrypt.hash(creds.password, 10)
  const user = await prisma.user.upsert({
    where: { email: creds.email },
    create: {
      email: creds.email,
      name: creds.name,
      password: passwordHash,
    },
    update: {
      name: creds.name,
      password: passwordHash,
    },
    select: { id: true, email: true, name: true, password: true },
  })

  return user.password ? user : null
}

export async function verifyAdminLogin(
  email: string,
  password: string,
): Promise<{ id: string; email: string; name: string | null } | null> {
  const normalizedEmail = email.trim().toLowerCase()
  const envAdmin = getAdminCredentialsFromEnv()

  if (envAdmin && normalizedEmail !== envAdmin.email) {
    return null
  }

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true, name: true, password: true },
  })

  if (!user?.password && envAdmin && normalizedEmail === envAdmin.email) {
    const bootstrapped = await bootstrapAdminUserFromEnv()
    if (bootstrapped) {
      user = bootstrapped
    }
  }

  if (!user?.password) return null

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    if (envAdmin && normalizedEmail === envAdmin.email && password === envAdmin.password) {
      const bootstrapped = await bootstrapAdminUserFromEnv()
      if (!bootstrapped?.password) return null
      const retry = await bcrypt.compare(password, bootstrapped.password)
      if (!retry) return null
      return { id: bootstrapped.id, email: bootstrapped.email, name: bootstrapped.name }
    }
    return null
  }

  return { id: user.id, email: user.email, name: user.name }
}
