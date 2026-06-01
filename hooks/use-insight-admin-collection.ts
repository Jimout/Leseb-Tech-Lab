'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  readInsightsFromStorage,
  saveInsightsToStorage,
} from '@/lib/frontend-content'
import { isAdminLoggedIn } from '@/lib/frontend-auth'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

const ADMIN_SESSION_ERROR = 'Session expired. Please log in again.'

export function useInsightAdminCollection() {
  const router = useRouter()
  const pathname = usePathname()
  const [items, setItems] = React.useState<ShowcaseInsight[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const redirectToLogin = React.useCallback(() => {
    const next = pathname ?? '/leseb-admin/overview'
    router.replace(`/leseb-admin/login?callbackUrl=${encodeURIComponent(next)}`)
  }, [pathname, router])

  React.useEffect(() => {
    setLoading(true)
    setError(null)
    if (!isAdminLoggedIn()) {
      setItems([])
      setError(ADMIN_SESSION_ERROR)
      redirectToLogin()
      setLoading(false)
      return
    }
    setItems(readInsightsFromStorage())
    setLoading(false)
  }, [redirectToLogin])

  const persist = React.useCallback(
    async (next: ShowcaseInsight[]) => {
      if (!isAdminLoggedIn()) {
        setError(ADMIN_SESSION_ERROR)
        redirectToLogin()
        return false
      }
      setError(null)
      const saved = saveInsightsToStorage(next)
      setItems(saved)
      return true
    },
    [redirectToLogin],
  )

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
