'use client'

import * as React from 'react'

import { readJson, writeJson } from '@/lib/admin/storage'

export function useAdminCollection<T extends { id: string }>(opts: {
  storageKey: string
  seed: readonly T[]
}) {
  const { storageKey, seed } = opts
  const [items, setItems] = React.useState<T[]>(() => [...seed])
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const stored = readJson<T[]>(storageKey)
    if (stored && Array.isArray(stored)) setItems(stored)
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  React.useEffect(() => {
    if (!hydrated) return
    writeJson(storageKey, items)
    window.dispatchEvent(new CustomEvent('leseb-storage', { detail: { key: storageKey } }))
  }, [hydrated, items, storageKey])

  const upsert = React.useCallback((next: T) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === next.id)
      if (idx === -1) return [next, ...prev]
      const copy = [...prev]
      copy[idx] = next
      return copy
    })
  }, [])

  const remove = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { items, setItems, upsert, remove }
}

