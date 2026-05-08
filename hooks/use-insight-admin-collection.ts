'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { clearSessionHeaderFromStorage, getSessionHeaderFromStorage } from '@/lib/session-header-client'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

const ADMIN_SESSION_ERROR = 'Session expired. Please log in again.'

export function useInsightAdminCollection() {
  const router = useRouter()
  const pathname = usePathname()
  const [items, setItems] = React.useState<ShowcaseInsight[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const redirectToLogin = React.useCallback(() => {
    const next = pathname ?? '/adminopia/overview'
    router.replace(`/adminopia/login?callbackUrl=${encodeURIComponent(next)}`)
  }, [pathname, router])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const sessionHeader = getSessionHeaderFromStorage()
        if (!sessionHeader) {
          if (!cancelled) {
            setItems([])
            setError(ADMIN_SESSION_ERROR)
          }
          redirectToLogin()
          return
        }
        const res = await fetch('/api/admin/insights', {
          cache: 'no-store',
          headers: { 'x-session': sessionHeader },
        })
        if (!res.ok) {
          if (!cancelled) {
            setItems([])
            setError(
              res.status === 401 || res.status === 403
                ? ADMIN_SESSION_ERROR
                : 'Failed to load insights from server.',
            )
          }
          if (res.status === 401 || res.status === 403) {
            clearSessionHeaderFromStorage()
            redirectToLogin()
          }
          return
        }
        const data = (await res.json()) as { insights?: ShowcaseInsight[] }
        if (!cancelled) setItems(Array.isArray(data.insights) ? data.insights : [])
      } catch {
        if (!cancelled) {
          setItems([])
          setError('Network error while loading insights.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [redirectToLogin])

  const persist = React.useCallback(async (next: ShowcaseInsight[]) => {
    const sessionHeader = getSessionHeaderFromStorage()
    if (!sessionHeader) {
      setError(ADMIN_SESSION_ERROR)
      redirectToLogin()
      return false
    }

    setError(null)
    const response = await fetch('/api/admin/insights', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-session': sessionHeader },
      body: JSON.stringify({ insights: next }),
    })
    if (!response.ok) {
      setError(
        response.status === 401 || response.status === 403
          ? ADMIN_SESSION_ERROR
          : 'Failed to save insights.',
      )
      if (response.status === 401 || response.status === 403) {
        clearSessionHeaderFromStorage()
        redirectToLogin()
      }
      return false
    }

    const data = (await response.json()) as { insights?: ShowcaseInsight[] }
    setItems(Array.isArray(data.insights) ? data.insights : next)
    return true
  }, [redirectToLogin])

  const upsert = React.useCallback(
    async (next: ShowcaseInsight) => {
      const idx = items.findIndex((p) => p.id === next.id)
      const merged = idx === -1 ? [next, ...items] : items.map((x, i) => (i === idx ? next : x))
      return persist(merged)
    },
    [items, persist],
  )

  const remove = React.useCallback(
    async (id: string) => {
      return persist(items.filter((x) => x.id !== id))
    },
    [items, persist],
  )

  return { items, setItems: persist, upsert, remove, loading, error }
}
