import type { SiteSettings } from '@/lib/admin/site-settings'
import { readSiteSettings, writeSiteSettings } from '@/lib/admin/site-settings'

export async function fetchSiteSettings(): Promise<SiteSettings> {
  return readSiteSettings()
}

export async function persistSiteSettings(next: SiteSettings): Promise<boolean> {
  writeSiteSettings(next)
  return true
}
