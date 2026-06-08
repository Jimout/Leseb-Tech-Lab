'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { normalizePortfolioCatalogFiltersState } from '@/lib/portfolio-catalog-filters'

type PortfolioCatalogFiltersState = ReturnType<typeof normalizePortfolioCatalogFiltersState>

export type SiteSettings = {
  portfolioCatalogFilters: PortfolioCatalogFiltersState
  [key: string]: unknown
}

type SiteSettingsApiResponse = {
  settings: SiteSettings
}

function normalizeSiteSettings(value: unknown): SiteSettings {
  const source =
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    ...source,
    portfolioCatalogFilters: normalizePortfolioCatalogFiltersState(
      source.portfolioCatalogFilters,
    ),
  }
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => normalizeSiteSettings({}))
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSettings() {
      try {
        setError(null)

        const response = await fetch('/api/admin/site-settings', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch site settings.')
        }

        const data = (await response.json()) as SiteSettingsApiResponse

        if (cancelled) return

        setSettings(normalizeSiteSettings(data.settings))
        setReady(true)
      } catch (error) {
        console.error('[USE_SITE_SETTINGS_FETCH]', error)

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to fetch site settings.',
          )
          setReady(true)
        }
      }
    }

    void fetchSettings()

    return () => {
      cancelled = true
    }
  }, [])

  const patch = useCallback(
    async (partial: Partial<SiteSettings>) => {
      setSaving(true)
      setError(null)

      try {
        /**
         * Your existing API uses PUT and expects the whole settings object.
         * So we merge partial changes with current settings before sending.
         */
        const nextPayload = normalizeSiteSettings({
          ...settings,
          ...partial,
        })

        console.log('[SITE_SETTINGS_SAVE_PAYLOAD]', nextPayload)

        const response = await fetch('/api/site-settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nextPayload),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => null)

          throw new Error(data?.error || 'Failed to save site settings.')
        }

        const data = (await response.json()) as SiteSettingsApiResponse
        const nextSettings = normalizeSiteSettings(data.settings)

        console.log('[SITE_SETTINGS_SAVE_RESPONSE]', nextSettings)

        setSettings(nextSettings)

        return nextSettings
      } catch (error) {
        console.error('[USE_SITE_SETTINGS_PUT]', error)

        const message =
          error instanceof Error ? error.message : 'Failed to save site settings.'

        setError(message)

        throw error
      } finally {
        setSaving(false)
      }
    },
    [settings],
  )

  return useMemo(
    () => ({
      settings,
      patch,
      ready,
      saving,
      error,
    }),
    [settings, patch, ready, saving, error],
  )
}