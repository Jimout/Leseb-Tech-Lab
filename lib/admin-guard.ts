type SessionLike = {
  user?: {
    email?: string | null
  } | null
} | null

export function isAllowedAdminSession(session: SessionLike) {
  const sessionEmail = session?.user?.email?.toLowerCase()
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  if (!sessionEmail) return false
  if (!adminEmail) return true
  return sessionEmail === adminEmail
}
