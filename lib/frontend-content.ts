import { createId } from '@paralleldrive/cuid2'

import { readJson, writeJson } from '@/lib/admin/storage'
import { WORK_STORAGE_KEY } from '@/lib/admin/work-storage-key'
import { insightHref, type ShowcaseInsight } from '@/lib/insights-showcase-data'
import { slugifyTitle } from '@/lib/slug-format'
import type { WorkRow } from '@/lib/work-admin-types'

export const INSIGHT_STORAGE_KEY = 'admin:insights:v1'

const WORK_PUBLIC_ID_PREFIX = 'W'
const INSIGHT_PUBLIC_ID_PREFIX = 'I'

function nextPublicId(prefix: string, existing: string[]): string {
  let max = 0
  for (const value of existing) {
    const v = value.trim().toUpperCase()
    if (!v.startsWith(prefix)) continue
    const n = Number.parseInt(v.slice(prefix.length), 10)
    if (Number.isFinite(n) && n > max) max = n
  }
  return `${prefix}${max + 1}`
}

export function readWorkRowsFromStorage(): WorkRow[] {
  return readJson<WorkRow[]>(WORK_STORAGE_KEY) ?? []
}

export function writeWorkRowsToStorage(rows: WorkRow[]) {
  writeJson(WORK_STORAGE_KEY, rows)
}

export function readInsightsFromStorage(): ShowcaseInsight[] {
  return readJson<ShowcaseInsight[]>(INSIGHT_STORAGE_KEY) ?? []
}

export function writeInsightsToStorage(insights: ShowcaseInsight[]) {
  writeJson(INSIGHT_STORAGE_KEY, insights)
}

export function createWorkRowInStorage(input: WorkRow): WorkRow {
  const rows = readWorkRowsFromStorage()
  const id = input.id.trim() || createId()
  const slug = slugifyTitle(input.slug.trim() || input.title)
  const publicId = input.publicId.trim() || nextPublicId(WORK_PUBLIC_ID_PREFIX, rows.map((r) => r.publicId))
  const created: WorkRow = { ...input, id, slug, publicId }
  writeWorkRowsToStorage([created, ...rows.filter((r) => r.id !== id)])
  return created
}

export function saveWorkRowsToStorage(rows: WorkRow[]): WorkRow[] {
  const normalized = rows.map((row) => ({
    ...row,
    slug: slugifyTitle(row.slug.trim() || row.title),
    filterIds: [...row.filterIds],
  }))
  writeWorkRowsToStorage(normalized)
  return normalized
}

export function createInsightInStorage(input: ShowcaseInsight): ShowcaseInsight {
  const items = readInsightsFromStorage()
  const id = input.id.trim() || createId()
  const slug = slugifyTitle(input.slug.trim() || input.title)
  const publicId =
    input.publicId.trim() || nextPublicId(INSIGHT_PUBLIC_ID_PREFIX, items.map((r) => r.publicId))
  const created: ShowcaseInsight = {
    ...input,
    id,
    slug,
    publicId,
    href: input.href?.trim() || insightHref(slug),
    filterIds: [...input.filterIds],
  }
  writeInsightsToStorage([created, ...items.filter((r) => r.id !== id)])
  return created
}

export function saveInsightsToStorage(insights: ShowcaseInsight[]): ShowcaseInsight[] {
  const normalized = insights.map((row) => {
    const slug = slugifyTitle(row.slug.trim() || row.title)
    return {
      ...row,
      slug,
      href: row.href?.trim() || insightHref(slug),
      filterIds: [...row.filterIds],
    }
  })
  writeInsightsToStorage(normalized)
  return normalized
}
