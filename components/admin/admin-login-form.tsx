'use client'

import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { saveSessionHeaderToStorage } from '@/lib/session-header-client'

function safeCallbackUrl(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/adminopia/overview'
  if (!raw.startsWith('/adminopia')) return '/adminopia/overview'
  return raw
}

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('admin@leseb.com')
  const [password, setPassword] = useState('admin123')
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
          const result = await signIn('credentials', {
            email: email.trim(),
            password,
            redirect: false,
          })
          if (result?.error) {
            setError('Invalid email or password.')
            return
          }
          if (result?.ok) {
            const headerSessionResponse = await fetch('/api/login', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                email: email.trim(),
                password,
              }),
            })
            if (!headerSessionResponse.ok) {
              setError('Signed in, but failed to create header session.')
              return
            }
            const sessionHeader = headerSessionResponse.headers.get('x-session')
            if (!sessionHeader) {
              setError('Signed in, but no header session was returned.')
              return
            }
            saveSessionHeaderToStorage(sessionHeader)
            router.push(
              safeCallbackUrl(searchParams.get('callbackUrl')),
            )
            router.refresh()
          }
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
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          // Improve readability on 2K/4K by making inputs slightly taller.
          // (Input component already sets base height/text, these override it.)
          //
          // Note: Tailwind merges these className strings left-to-right; later classes win.
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
          // In this admin setup, credentials are stored locally per browser.
          // So "forgot password" resets this browser back to default credentials.
          setError(null)
          setEmail('admin@leseb.com')
          setPassword('admin123')
        }}
        className="w-full text-center text-[11px] text-white/65 underline underline-offset-4 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 2xl:text-xs 4xl:text-sm"
      >
        Forgot password?
      </button>
      <p className="text-xs text-white/55 2xl:text-sm 4xl:text-base">
        Default local login: admin@leseb.com / admin123 (from .env). Restart the dev
        server after changing .env.
      </p>
    </form>
  )
}
