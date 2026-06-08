// components/visit-tracker.tsx
'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function VisitTracker() {
  const pathname = usePathname()
  const lastKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/admin') || pathname.startsWith('/leseb-admin')) return

    const now = Date.now()
    const key = `${pathname}:${Math.floor(now / 2000)}`
    if (lastKeyRef.current === key) return
    lastKeyRef.current = key

    void fetch('/api/visits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Best-effort analytics; never block navigation/UI on failures.
    })
  }, [pathname])

  return null
}

