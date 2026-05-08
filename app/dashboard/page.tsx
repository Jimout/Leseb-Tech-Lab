'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { decodeSessionHeaderPayload, type SessionHeaderUser } from '@/lib/session-header-shared'

const SESSION_STORAGE_KEY = 'user-session-header'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<SessionHeaderUser | null>(null)

  useEffect(() => {
    const sessionHeader = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!sessionHeader) {
      router.replace('/login')
      return
    }

    const payload = decodeSessionHeaderPayload(sessionHeader)
    if (!payload?.user?.id) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      router.replace('/login')
      return
    }

    setUser(payload.user)

    void (async () => {
      try {
        const response = await fetch('/api/session', {
          headers: {
            'x-session': sessionHeader,
          },
        })

        if (!response.ok) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY)
          router.replace('/login')
          return
        }

        const serverPayload = (await response.json()) as { user?: SessionHeaderUser }
        if (serverPayload.user?.id) {
          setUser(serverPayload.user)
        }
      } catch {
        // Keep using locally decoded header if validation request fails temporarily.
      }
    })()
  }, [router])

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
        <p className="text-sm text-white/70">Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-white/70">Welcome, your session was read from the encoded header.</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-white/60">Name:</span> {user.name ?? 'No name'}
          </p>
          <p>
            <span className="text-white/60">Email:</span> {user.email}
          </p>
          <p>
            <span className="text-white/60">User ID:</span> {user.id}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(SESSION_STORAGE_KEY)
            router.push('/login')
          }}
          className="h-10 rounded-md border border-white/20 px-4 text-sm hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </main>
  )
}
