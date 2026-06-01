'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { useAdminAuthContext } from '@/components/providers/admin-auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { safeAdminCallbackUrl } from '@/lib/admin/admin-routes'
import { defaultAdminAccount, loginAdmin } from '@/lib/frontend-auth'

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refresh } = useAdminAuthContext()

  const defaults = defaultAdminAccount()
  const [email, setEmail] = useState(defaults.email)
  const [password, setPassword] = useState(defaults.password)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !submitting

  return (
    <form
      className="space-y-4 2xl:space-y-5 4xl:space-y-6"
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
          const ok = loginAdmin(email.trim(), password)
          if (!ok) {
            setError('Invalid email or password.')
            return
          }
          refresh()
          router.push(safeAdminCallbackUrl(searchParams.get('callbackUrl')))
        } catch {
          setError('Something went wrong. Try again.')
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="admin-email" className="text-white/80 2xl:text-base 4xl:text-lg">
          Email
        </Label>
        <Input
          id="admin-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40 2xl:h-11 4xl:h-12 2xl:py-1.5 4xl:py-2"
          placeholder="you@example.com"
          disabled={submitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password" className="text-white/80 2xl:text-base 4xl:text-lg">
          Password
        </Label>
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-white/5 pr-10 text-white placeholder:text-white/40 2xl:h-11 4xl:h-12 2xl:py-1.5 4xl:py-2"
            placeholder="••••••••"
            disabled={submitting}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={submitting}
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-300 2xl:text-base 4xl:text-lg" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full 2xl:h-11 4xl:h-12 2xl:text-base 4xl:text-lg 2xl:px-6 4xl:px-8"
        disabled={!canSubmit}
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Signing in…
          </span>
        ) : (
          'Sign in'
        )}
      </Button>
      <button
        type="button"
        onClick={() => {
          setError(null)
          const next = defaultAdminAccount()
          setEmail(next.email)
          setPassword(next.password)
        }}
        className="w-full text-center text-[11px] text-white/65 underline underline-offset-4 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 2xl:text-xs 4xl:text-sm"
      >
        Forgot password?
      </button>
      <p className="text-xs text-white/55 2xl:text-sm 4xl:text-base">
        Default login: admin@leseb.com / admin123. Credentials are stored in this browser only.
      </p>
    </form>
  )
}
