'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { decodeSessionHeaderPayload } from '@/lib/session-header-shared'

const SESSION_STORAGE_KEY = 'user-session-header'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <form
        className="w-full space-y-4 rounded-xl border border-white/10 bg-white/5 p-6"
        onSubmit={async (event) => {
          event.preventDefault()
          setLoading(true)
          setError(null)

          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                email: email.trim(),
                password,
              }),
            })

            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as { error?: string } | null
              setError(payload?.error ?? 'Login failed')
              return
            }

            const sessionHeader = response.headers.get('x-session')
            if (!sessionHeader) {
              setError('Session header was not returned by server')
              return
            }

            const decoded = decodeSessionHeaderPayload(sessionHeader)
            if (!decoded?.user?.id) {
              setError('Could not decode returned session header')
              return
            }

            sessionStorage.setItem(SESSION_STORAGE_KEY, sessionHeader)
            router.push('/dashboard')
            router.refresh()
          } catch {
            setError('Something went wrong. Please try again.')
          } finally {
            setLoading(false)
          }
        }}
      >
        <h1 className="text-xl font-semibold text-white">Login</h1>
        <p className="text-sm text-white/70">Sign in to open your dashboard.</p>
        <label className="block space-y-1">
          <span className="text-sm text-white/80">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 w-full rounded-md border border-white/15 bg-background/20 px-3 text-sm text-white outline-none focus:border-white/30"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-white/80">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 w-full rounded-md border border-white/15 bg-background/20 px-3 text-sm text-white outline-none focus:border-white/30"
            placeholder="********"
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="h-10 w-full rounded-md bg-white text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
