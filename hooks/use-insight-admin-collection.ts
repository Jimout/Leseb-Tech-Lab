'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  clearSessionHeaderFromStorage,
  getSessionHeaderFromStorage,
} from '@/lib/session-header-client'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

const ADMIN_SESSION_ERROR = 'Session expired. Please log in again.'

export function useInsightAdminCollection() {
  const router = useRouter()
  const pathname = usePathname()

  const [items, setItemsState] = React.useState<ShowcaseInsight[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const redirectToLogin = React.useCallback(() => {
    const next = pathname ?? '/leseb-admin/overview'
    router.replace(`/leseb-admin/login?callbackUrl=${encodeURIComponent(next)}`)
  }, [pathname, router])

  const getSessionOrRedirect = React.useCallback(() => {
    const sessionHeader = getSessionHeaderFromStorage()

    if (!sessionHeader) {
      setError(ADMIN_SESSION_ERROR)
      redirectToLogin()
      return null
    }

    return sessionHeader
  }, [redirectToLogin])

  const handleAuthFailure = React.useCallback(
    (status: number) => {
      if (status === 401 || status === 403) {
        clearSessionHeaderFromStorage()
        setError(ADMIN_SESSION_ERROR)
        redirectToLogin()
        return true
      }

      return false
    },
    [redirectToLogin],
  )

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    const sessionHeader = getSessionOrRedirect()

    if (!sessionHeader) {
      setItemsState([])
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/insights', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'x-session': sessionHeader,
        },
      })

      if (!res.ok) {
        if (!handleAuthFailure(res.status)) {
          setError('Failed to load insights from server.')
        }

        setItemsState([])
        return
      }

      const data = (await res.json()) as { insights?: ShowcaseInsight[] }
      setItemsState(Array.isArray(data.insights) ? data.insights : [])
    } catch {
      setItemsState([])
      setError('Network error while loading insights.')
    } finally {
      setLoading(false)
    }
  }, [getSessionOrRedirect, handleAuthFailure])

  React.useEffect(() => {
    void reload()
  }, [reload])

  const setItems = React.useCallback(
    async (next: ShowcaseInsight[]) => {
      const sessionHeader = getSessionOrRedirect()
      if (!sessionHeader) return false

      setError(null)

      try {
        const response = await fetch('/api/admin/insights', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-session': sessionHeader,
          },
          body: JSON.stringify({ insights: next }),
        })

        if (!response.ok) {
          if (!handleAuthFailure(response.status)) {
            setError('Failed to save insights.')
          }

          return false
        }

        const data = (await response.json()) as { insights?: ShowcaseInsight[] }
        setItemsState(Array.isArray(data.insights) ? data.insights : next)

        return true
      } catch {
        setError('Network error while saving insights.')
        return false
      }
    },
    [getSessionOrRedirect, handleAuthFailure],
  )

  const create = React.useCallback(
    async (next: ShowcaseInsight) => {
      const sessionHeader = getSessionOrRedirect()
      if (!sessionHeader) return null

      setError(null)

      try {
        const response = await fetch('/api/admin/insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session': sessionHeader,
          },
          body: JSON.stringify(next),
        })

        if (!response.ok) {
          if (!handleAuthFailure(response.status)) {
            setError('Failed to create insight.')
          }

          return null
        }

        const data = (await response.json()) as { insight?: ShowcaseInsight }

        if (data.insight) {
          setItemsState((prev) => [data.insight as ShowcaseInsight, ...prev])
          return data.insight
        }

        return null
      } catch {
        setError('Network error while creating insight.')
        return null
      }
    },
    [getSessionOrRedirect, handleAuthFailure],
  )

  const upsert = React.useCallback(
    async (next: ShowcaseInsight) => {
      const existing = items.find((item) => item.id === next.id)

      if (!existing) {
        const created = await create(next)
        return Boolean(created)
      }

      const merged = items.map((item) => (item.id === next.id ? next : item))
      return setItems(merged)
    },
    [items, create, setItems],
  )

  const remove = React.useCallback(
    async (id: string) => {
      const sessionHeader = getSessionOrRedirect()
      if (!sessionHeader) return false

      setError(null)

      try {
        // ✅ FIXED: Use path parameter instead of query parameter
        const response = await fetch(`/api/admin/insights/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: {
            'x-session': sessionHeader,
          },
        })

        if (!response.ok) {
          if (!handleAuthFailure(response.status)) {
            setError('Failed to delete insight.')
          }

          return false
        }

        const data = (await response.json()) as { insights?: ShowcaseInsight[] }

        if (Array.isArray(data.insights)) {
          setItemsState(data.insights)
        } else {
          setItemsState((prev) => prev.filter((item) => item.id !== id))
        }

        return true
      } catch {
        setError('Network error while deleting insight.')
        return false
      }
    },
    [getSessionOrRedirect, handleAuthFailure],
  )

  return {
    items,
    setItems,
    create,
    upsert,
    remove,
    reload,
    loading,
    error,
  }
}