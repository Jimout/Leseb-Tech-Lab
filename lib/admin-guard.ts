import { userHasPassword } from '@/lib/admin/user-auth'

type SessionLike = {
  user?: {
    email?: string | null
  } | null
} | null

/** True when the session email belongs to a database user with a password (admin login). */
export async function isAllowedAdminSession(session: SessionLike): Promise<boolean> {
  const sessionEmail = session?.user?.email?.trim().toLowerCase()
  if (!sessionEmail) return false
  try {
    return await userHasPassword(sessionEmail)
  } catch (error) {
    console.error('[auth] isAllowedAdminSession failed:', error)
    return false
  }
}
