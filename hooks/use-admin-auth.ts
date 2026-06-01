'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { useAdminAuthContext } from '@/components/providers/admin-auth-provider'

export function useAdminAuth() {
  const { authed, logout: contextLogout } = useAdminAuthContext()
  const router = useRouter()

  const logout = useCallback(() => {
    contextLogout()
    router.push('/leseb-admin/login')
  }, [contextLogout, router])

  return { authed, logout }
}
