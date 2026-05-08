'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { clearSessionHeaderFromStorage, getSessionHeaderFromStorage } from '@/lib/session-header-client'
import type { WorkRow } from '@/lib/work-admin-types'

const ADMIN_SESSION_ERROR = 'Session expired. Please log in again.'

export function useWorkAdminCollection() {
  const router = useRouter()
  const pathname = usePathname()
  const [items, setItems] = React.useState<WorkRow[]>([])
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
        const res = await fetch('/api/admin/work-rows', {
          cache: 'no-store',
          headers: { 'x-session': sessionHeader },
        })
        if (!res.ok) {
          if (!cancelled) {
            setItems([])
            setError(
              res.status === 401 || res.status === 403
                ? ADMIN_SESSION_ERROR
                : 'Failed to load work rows from server.',
            )
          }
          if (res.status === 401 || res.status === 403) {
            clearSessionHeaderFromStorage()
            redirectToLogin()
          }
          return
        }
        const data = (await res.json()) as { rows?: WorkRow[] }
        if (!cancelled) {
          setItems(Array.isArray(data.rows) ? data.rows : [])
        }
      } catch {
        if (!cancelled) {
          setItems([])
          setError('Network error while loading work rows.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [redirectToLogin])

  const persist = React.useCallback(async (next: WorkRow[]) => {
    const sessionHeader = getSessionHeaderFromStorage()
    if (!sessionHeader) {
      setError(ADMIN_SESSION_ERROR)
      redirectToLogin()
      return false
    }

    setError(null)
    const response = await fetch('/api/admin/work-rows', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-session': sessionHeader },
      body: JSON.stringify({ rows: next }),
    })
    if (!response.ok) {
      setError(
        response.status === 401 || response.status === 403
          ? ADMIN_SESSION_ERROR
          : 'Failed to save work rows.',
      )
      if (response.status === 401 || response.status === 403) {
        clearSessionHeaderFromStorage()
        redirectToLogin()
      }
      return false
    }

    const data = (await response.json()) as { rows?: WorkRow[] }
    setItems(Array.isArray(data.rows) ? data.rows : next)
    return true
  }, [redirectToLogin])

  const upsert = React.useCallback(
    async (next: WorkRow) => {
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

