'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { ADMIN_LOGIN_PATH, isAdminLoginPath } from '@/lib/admin/admin-routes'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()

  const isLogin = isAdminLoginPath(pathname)
  const hasSessionHeader =
    status === 'authenticated' ? Boolean(getSessionHeaderFromStorage()) : false

  useEffect(() => {
    if (!pathname || isLogin) return
    if (status === 'unauthenticated') {
      router.replace(
        `${ADMIN_LOGIN_PATH}?callbackUrl=${encodeURIComponent(pathname)}`,
      )
    }
  }, [pathname, status, isLogin, router])

  useEffect(() => {
    if (!pathname || isLogin || status !== 'authenticated' || hasSessionHeader) return
    router.replace(
      `${ADMIN_LOGIN_PATH}?callbackUrl=${encodeURIComponent(pathname)}`,
    )
  }, [pathname, status, isLogin, hasSessionHeader, router])

  if (isLogin) return children

  if (status === 'loading') {
    return <AdminLoadingScreen />
  }
  if (status === 'unauthenticated') return null
  if (!hasSessionHeader) return null
  return children
}
