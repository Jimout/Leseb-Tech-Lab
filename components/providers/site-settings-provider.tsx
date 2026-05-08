'use client'

import * as React from 'react'

import type { SiteSettings } from '@/lib/admin/site-settings'
import { DEFAULT_SITE_SETTINGS, mergeDeep } from '@/lib/admin/site-settings'
import { fetchSiteSettings, persistSiteSettings } from '@/lib/site-settings-client'

type SiteSettingsContextValue = {
  settings: SiteSettings
  saveAll: (next: SiteSettings) => Promise<boolean>
  patch: (p: Partial<SiteSettings>) => void
  ready: boolean
}

const SiteSettingsContext = React.createContext<SiteSettingsContextValue | null>(null)

export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: SiteSettings
  children: React.ReactNode
}) {
  const [settings, setSettings] = React.useState<SiteSettings>(initialSettings)

  /** True once mounted — SSR/initial payload already has settings; client fetch refreshes in the background. */
  const ready = true

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const loaded = await fetchSiteSettings()
        if (!cancelled) setSettings(loaded)
      } catch {
        if (!cancelled) setSettings(DEFAULT_SITE_SETTINGS)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const saveAll = React.useCallback(async (next: SiteSettings) => {
    const ok = await persistSiteSettings(next)
    if (ok) setSettings(next)
    return ok
  }, [])

  const patch = React.useCallback((p: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const next = mergeDeep(prev, p)
      void persistSiteSettings(next).then((ok) => {
        if (!ok) console.error('Failed to save site settings')
      })
      return next
    })
  }, [])

  const value = React.useMemo(
    () => ({ settings, saveAll, patch, ready }),
    [settings, saveAll, patch, ready],
  )

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = React.useContext(SiteSettingsContext)
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  }
  return ctx
}
