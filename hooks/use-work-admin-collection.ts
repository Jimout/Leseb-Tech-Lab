'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  readWorkRowsFromStorage,
  saveWorkRowsToStorage,
} from '@/lib/frontend-content'
import { isAdminLoggedIn } from '@/lib/frontend-auth'
import type { WorkRow } from '@/lib/work-admin-types'

const ADMIN_SESSION_ERROR = 'Session expired. Please log in again.'

export function useWorkAdminCollection() {
  const router = useRouter()
  const pathname = usePathname()
  const [items, setItems] = React.useState<WorkRow[]>([])
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
    setItems(readWorkRowsFromStorage())
    setLoading(false)
  }, [redirectToLogin])

  const persist = React.useCallback(
    async (next: WorkRow[]) => {
      if (!isAdminLoggedIn()) {
        setError(ADMIN_SESSION_ERROR)
        redirectToLogin()
        return false
      }
      setError(null)
      const saved = saveWorkRowsToStorage(next)
      setItems(saved)
      return true
    },
    [redirectToLogin],
  )

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
