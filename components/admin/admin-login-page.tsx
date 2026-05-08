'use client'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
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
    return (
      <Card className="flex w-full max-w-md items-center justify-center gap-2 rounded-2xl border-white/10 bg-white/5 px-8 py-12 sm:px-10 2xl:max-w-lg 4xl:max-w-xl 2xl:px-10 4xl:px-12 2xl:py-14 4xl:py-16">
        <Spinner className="h-5 w-5 text-white/70" />
        <span className="text-sm text-white/70 2xl:text-base 4xl:text-lg">Loading…</span>
      </Card>
    )
  }

  if (status === 'authenticated' && hasHeaderSession) {
    return null
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-white/10 bg-white/5 p-6 sm:p-7 2xl:max-w-lg 4xl:max-w-xl 2xl:p-8 4xl:p-10">
      <div className="flex items-center gap-3">
        <div className="relative size-10 shrink-0 2xl:size-12 4xl:size-14">
          <Image
            src="/images/Logo.png"
            alt=""
            fill
            sizes="40px"
            className="object-contain object-center scale-125"
            aria-hidden
          />
        </div>
        <p className="text-sm font-semibold text-white 2xl:text-base 4xl:text-lg">
          natty<span className="text-accent">opia</span> space
        </p>
      </div>
      <p className="mt-2 text-sm text-white/65 2xl:text-base 4xl:text-lg">Sign in to continue.</p>
      <div className="mt-6 2xl:mt-8 4xl:mt-10">
        <AdminLoginForm />
      </div>
    </Card>
  )
}
