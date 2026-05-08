import type { SiteSettings } from '@/lib/admin/site-settings'

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/site-settings', {
    cache: 'no-store',
    credentials: 'same-origin',
  })
  if (!res.ok) throw new Error('Failed to load site settings')
  const json = (await res.json()) as { settings?: SiteSettings }
  if (!json.settings) throw new Error('Invalid response')
  return json.settings
}

export async function persistSiteSettings(next: SiteSettings): Promise<boolean> {
  const res = await fetch('/api/site-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(next),
    credentials: 'same-origin',
  })
  return res.ok
}
