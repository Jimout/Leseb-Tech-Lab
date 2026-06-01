'use client'

import * as React from 'react'

import { isAdminLoggedIn, logoutAdmin } from '@/lib/frontend-auth'

type AdminAuthContextValue = {
  authed: boolean
  ready: boolean
  logout: () => void
  refresh: () => void
}

const AdminAuthContext = React.createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = React.useState(false)
  const [ready, setReady] = React.useState(false)

  const refresh = React.useCallback(() => {
    setAuthed(isAdminLoggedIn())
    setReady(true)
  }, [])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  const logout = React.useCallback(() => {
    logoutAdmin()
    setAuthed(false)
  }, [])

  const value = React.useMemo(
    () => ({ authed, ready, logout, refresh }),
    [authed, ready, logout, refresh],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuthContext(): AdminAuthContextValue {
  const ctx = React.useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider')
  }
  return ctx
}
