'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { ADMIN_LOGIN_PATH, isAdminLoginPath } from '@/lib/admin/admin-routes'
import { useAdminAuthContext } from '@/components/providers/admin-auth-provider'

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { authed, ready } = useAdminAuthContext()

  const isLogin = isAdminLoginPath(pathname)

  useEffect(() => {
    if (!pathname || isLogin || !ready) return
    if (!authed) {
      router.replace(`${ADMIN_LOGIN_PATH}?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [pathname, authed, ready, isLogin, router])

  if (isLogin) return children

  if (!ready) {
    return <AdminLoadingScreen />
  }
  if (!authed) return null
  return children
}
