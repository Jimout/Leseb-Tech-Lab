'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getSessionHeaderFromStorage } from '@/lib/session-header-client'

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()
  const [headerChecked, setHeaderChecked] = useState(false)
  const [hasSessionHeader, setHasSessionHeader] = useState(false)

  const isLogin = pathname?.startsWith('/adminopia/login') ?? false

  useEffect(() => {
    if (!pathname || isLogin) return
    if (status === 'unauthenticated') {
      router.replace(
        `/adminopia/login?callbackUrl=${encodeURIComponent(pathname)}`,
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
        `/adminopia/login?callbackUrl=${encodeURIComponent(pathname)}`,
      )
    }
  }, [pathname, status, isLogin, router])

  if (isLogin) return children

  if (status === 'loading') return null
  if (status === 'unauthenticated') return null
  if (status === 'authenticated' && !headerChecked) return null
  if (status === 'authenticated' && !hasSessionHeader) return null
  return children
}
