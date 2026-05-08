import type { Prisma } from '@/lib/generated/prisma/client'
import { cache } from 'react'

import {
  DEFAULT_SITE_SETTINGS,
  normalizeStoredSiteSettings,
  type SiteSettings,
} from '@/lib/admin/site-settings'
import { prisma } from '@/lib/prisma'

const SITE_ROW_ID = 'default'

/**
 * One DB read per request (dedupes `generateMetadata` + page both calling this).
 */
const loadSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await prisma.globalSiteSettings.findUnique({
      where: { id: SITE_ROW_ID },
    })
    if (!row?.data) return DEFAULT_SITE_SETTINGS
    return normalizeStoredSiteSettings(row.data)
  } catch (e) {
    console.error('[site-settings] getSiteSettingsFromDb failed, using defaults:', e)
    return DEFAULT_SITE_SETTINGS
  }
})

/**
 * Loads persisted site settings, or defaults if the DB is unavailable,
 * the Prisma client is stale, or the row is missing.
 * Never throws — public routes must not hard-crash when the DB hiccups.
 */
export async function getSiteSettingsFromDb(): Promise<SiteSettings> {
  return loadSiteSettings()
}

export async function upsertSiteSettingsToDb(
  settings: SiteSettings,
): Promise<SiteSettings> {
  const data = JSON.parse(JSON.stringify(settings)) as Prisma.InputJsonValue
  await prisma.globalSiteSettings.upsert({
    where: { id: SITE_ROW_ID },
    create: { id: SITE_ROW_ID, data },
    update: { data },
  })
  return settings
}
