import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'

import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'

export async function getAdminSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  const allowed = await isAllowedAdminSession(session)
  if (!allowed) return null
  return session
}
