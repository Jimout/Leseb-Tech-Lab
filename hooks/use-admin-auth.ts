'use client'

import { signOut, useSession } from 'next-auth/react'
import { useCallback } from 'react'

import { clearSessionHeaderFromStorage } from '@/lib/session-header-client'

export function useAdminAuth() {
  const { status } = useSession()
  const authed = status === 'authenticated'

  const logout = useCallback(() => {
    clearSessionHeaderFromStorage()
    void signOut({ callbackUrl: '/adminopia/login' })
  }, [])

  return { authed, logout }
}
