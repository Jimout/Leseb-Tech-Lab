'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { PortfolioCatalogFilterEntry } from '@/lib/portfolio-catalog-filters'

type CatalogFiltersResponse = {
  filters?: PortfolioCatalogFilterEntry[]
  error?: string
}

function defaultFilters(): PortfolioCatalogFilterEntry[] {
  return [
    {
      id: 'all',
      label: 'Explore all',
      visible: true,
      order: 0,
    },
  ]
}

function normalizeFilters(value: unknown): PortfolioCatalogFilterEntry[] {
  if (!Array.isArray(value)) {
    return defaultFilters()
  }

  return value.map((entry, index) => ({
    id: entry.id,
    label: entry.label,
    visible: entry.id === 'all' ? true : Boolean(entry.visible),
    order: index * 10,
  }))
}

export function usePortfolioCatalogFilters() {
  const [filters, setFilters] = useState<PortfolioCatalogFilterEntry[]>(() =>
    defaultFilters(),
  )
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)

    try {
      const response = await fetch('/api/admin/catalog-filters', {
        method: 'GET',
        cache: 'no-store',
      })

      const data = (await response.json()) as CatalogFiltersResponse

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load category filters.')
      }

      setFilters(normalizeFilters(data.filters))
      setReady(true)
    } catch (error) {
      console.error('[CATALOG_FILTERS_LOAD]', error)

      setError(
        error instanceof Error ? error.message : 'Failed to load category filters.',
      )
      setReady(true)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = useCallback(async (nextFilters: PortfolioCatalogFilterEntry[]) => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/catalog-filters', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: nextFilters,
        }),
      })

      const data = (await response.json()) as CatalogFiltersResponse

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category filters.')
      }

      const savedFilters = normalizeFilters(data.filters)

      setFilters(savedFilters)

      return savedFilters
    } catch (error) {
      console.error('[CATALOG_FILTERS_SAVE]', error)

      const message =
        error instanceof Error ? error.message : 'Failed to save category filters.'

      setError(message)

      throw error
    } finally {
      setSaving(false)
    }
  }, [])

  const add = useCallback(async (label: string): Promise<void> => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/catalog-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label }),
      })

      const data = (await response.json()) as CatalogFiltersResponse

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add category filter.')
      }

      const savedFilters = normalizeFilters(data.filters)
      setFilters(savedFilters)
    } catch (error) {
      console.error('[CATALOG_FILTERS_ADD]', error)

      const message =
        error instanceof Error ? error.message : 'Failed to add category filter.'

      setError(message)

      throw error
    } finally {
      setSaving(false)
    }
  }, [])

  return useMemo(
    () => ({
      filters,
      setFilters,
      ready,
      saving,
      error,
      load,
      save,
      add,
    }),
    [filters, ready, saving, error, load, save, add],
  )
}