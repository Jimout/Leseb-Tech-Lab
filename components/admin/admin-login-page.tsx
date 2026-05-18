'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { AdminBrandMark } from '@/components/admin/admin-brand-mark'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { Card } from '@/components/ui/card'
import { safeAdminCallbackUrl } from '@/lib/admin/admin-routes'
import { authErrorMessage } from '@/lib/auth-env'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'

export function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const [hasHeaderSession, setHasHeaderSession] = useState<boolean | null>(null)

  useEffect(() => {
    if (status !== 'authenticated') {
      setHasHeaderSession(null)
      return
    }

    const sessionHeader = getSessionHeaderFromStorage()
    const hasHeader = Boolean(sessionHeader)
    setHasHeaderSession(hasHeader)

    if (hasHeader) {
      router.replace(safeAdminCallbackUrl(searchParams.get('callbackUrl')))
    }
  }, [status, router, searchParams])

  if (status === 'loading' || (status === 'authenticated' && hasHeaderSession === null)) {
    return <AdminLoadingScreen message="Signing in" fullViewport className="min-h-0 py-12" />
  }

  if (status === 'authenticated' && hasHeaderSession) {
    return null
  }

  const authError = authErrorMessage(searchParams.get('error'))

  return (
    <Card className="w-full max-w-md rounded-2xl border-white/10 bg-white/5 p-6 sm:p-7 2xl:max-w-lg 4xl:max-w-xl 2xl:p-8 4xl:p-10">
      <AdminBrandMark logoSize="lg" />
      <p className="mt-2 text-sm text-white/65 2xl:text-base 4xl:text-lg">Sign in to continue.</p>
      {authError ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          {authError}
        </p>
      ) : null}
      <div className="mt-6 2xl:mt-8 4xl:mt-10">
        <AdminLoginForm />
      </div>
    </Card>
  )
}
