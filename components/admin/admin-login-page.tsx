'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { AdminBrandMark } from '@/components/admin/admin-brand-mark'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { Card } from '@/components/ui/card'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'

function safeCallbackUrl(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/adminopia/overview'
  if (!raw.startsWith('/adminopia')) return '/adminopia/overview'
  return raw
}

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
      router.replace(safeCallbackUrl(searchParams.get('callbackUrl')))
    }
  }, [status, router, searchParams])

  if (status === 'loading' || (status === 'authenticated' && hasHeaderSession === null)) {
    return <AdminLoadingScreen message="Signing in" fullViewport className="min-h-0 py-12" />
  }

  if (status === 'authenticated' && hasHeaderSession) {
    return null
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-white/10 bg-white/5 p-6 sm:p-7 2xl:max-w-lg 4xl:max-w-xl 2xl:p-8 4xl:p-10">
      <AdminBrandMark logoSize="lg" />
      <p className="mt-2 text-sm text-white/65 2xl:text-base 4xl:text-lg">Sign in to continue.</p>
      <div className="mt-6 2xl:mt-8 4xl:mt-10">
        <AdminLoginForm />
      </div>
    </Card>
  )
}
