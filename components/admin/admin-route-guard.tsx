'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { ADMIN_LOGIN_PATH, isAdminLoginPath } from '@/lib/admin/admin-routes'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()
  const [headerChecked, setHeaderChecked] = useState(false)
  const [hasSessionHeader, setHasSessionHeader] = useState(false)

  const isLogin = isAdminLoginPath(pathname)

  useEffect(() => {
    if (!pathname || isLogin) return
    if (status === 'unauthenticated') {
      router.replace(
        `${ADMIN_LOGIN_PATH}?callbackUrl=${encodeURIComponent(pathname)}`,
      )
    }
  }, [pathname, status, isLogin, router])

  useEffect(() => {
    if (!pathname || isLogin || status !== 'authenticated') {
      setHeaderChecked(false)
      return
    }

    const sessionHeader = getSessionHeaderFromStorage()
    const hasHeader = Boolean(sessionHeader)
    setHasSessionHeader(hasHeader)
    setHeaderChecked(true)

    if (!hasHeader) {
      router.replace(
        `${ADMIN_LOGIN_PATH}?callbackUrl=${encodeURIComponent(pathname)}`,
      )
    }
  }, [pathname, status, isLogin, router])

  if (isLogin) return children

  if (status === 'loading') {
    return <AdminLoadingScreen message="Loading workspace" />
  }
  if (status === 'unauthenticated') return null
  if (status === 'authenticated' && !headerChecked) {
    return <AdminLoadingScreen message="Loading workspace" />
  }
  if (status === 'authenticated' && !hasSessionHeader) return null
  return children
}
