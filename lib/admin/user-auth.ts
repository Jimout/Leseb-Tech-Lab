import bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

/** Default admin seeded on deploy / `npm run admin:seed` (not read from env at runtime). */
export const DEFAULT_ADMIN_USER_ID = 'admin-user'
export const DEFAULT_ADMIN_EMAIL = 'admin@leseb.com'
export const DEFAULT_ADMIN_NAME = 'Leseb Admin'

const BCRYPT_ROUNDS = 10

export type AuthUser = {
  id: string
  email: string
  name: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password.trim(), BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password.trim(), hash)
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const normalized = email.trim().toLowerCase()
  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { id: true, email: true, name: true, password: true },
  })
  if (!user?.password) return null
  return { id: user.id, email: user.email, name: user.name }
}

export async function userHasPassword(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { password: true },
  })
  return Boolean(user?.password)
}

/** Validate credentials against the User table only. */
export async function verifyUserLogin(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  try {
    const normalized = email.trim().toLowerCase()
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true, email: true, name: true, password: true },
    })
    if (!user?.password) return null
    const valid = await verifyPassword(password, user.password)
    if (!valid) return null
    return { id: user.id, email: user.email, name: user.name }
  } catch (error) {
    console.error('[auth] verifyUserLogin failed:', error)
    return null
  }
}

/** Create or refresh the default admin user (build / seed script only). */
export async function ensureDefaultAdminUser(password: string): Promise<AuthUser> {
  const email = DEFAULT_ADMIN_EMAIL
  const passwordHash = await hashPassword(password)
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      id: DEFAULT_ADMIN_USER_ID,
      email,
      name: DEFAULT_ADMIN_NAME,
      password: passwordHash,
    },
    update: {
      name: DEFAULT_ADMIN_NAME,
      password: passwordHash,
    },
    select: { id: true, email: true, name: true },
  })
  return user
}

export async function countUsersWithPassword(): Promise<number> {
  return prisma.user.count({
    where: { password: { not: null } },
  })
}

export async function updateUserAccount(input: {
  userId: string
  currentPassword: string
  email?: string
  newPassword?: string
}): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  const current = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true, email: true, name: true, password: true },
  })
  if (!current?.password) {
    return { ok: false, error: 'User not found.' }
  }

  const currentValid = await verifyPassword(input.currentPassword, current.password)
  if (!currentValid) {
    return { ok: false, error: 'Current password is incorrect.' }
  }

  const nextEmail = input.email?.trim().toLowerCase() ?? current.email
  if (!nextEmail) {
    return { ok: false, error: 'Email is required.' }
  }

  if (nextEmail !== current.email) {
    const taken = await prisma.user.findUnique({
      where: { email: nextEmail },
      select: { id: true },
    })
    if (taken && taken.id !== current.id) {
      return { ok: false, error: 'That email is already in use.' }
    }
  }

  const data: { email: string; password?: string; name?: string } = { email: nextEmail }
  if (input.newPassword?.trim()) {
    data.password = await hashPassword(input.newPassword)
  }

  const user = await prisma.user.update({
    where: { id: current.id },
    data,
    select: { id: true, email: true, name: true },
  })

  return { ok: true, user }
}
