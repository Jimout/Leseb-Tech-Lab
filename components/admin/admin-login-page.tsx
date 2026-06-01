'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { AdminBrandMark } from '@/components/admin/admin-brand-mark'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { Card } from '@/components/ui/card'
import { safeAdminCallbackUrl } from '@/lib/admin/admin-routes'
import { useAdminAuthContext } from '@/components/providers/admin-auth-provider'

export function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { authed, ready } = useAdminAuthContext()

  useEffect(() => {
    if (!ready || !authed) return
    router.replace(safeAdminCallbackUrl(searchParams.get('callbackUrl')))
  }, [authed, ready, router, searchParams])

  if (!ready) {
    return <AdminLoadingScreen fullViewport className="min-h-0 py-12" />
  }

  if (authed) {
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
