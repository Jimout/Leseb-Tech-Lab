'use client'

import * as React from 'react'

import { LEGACY_CATALOG_FILTER_IDS, migrateCatalogFilterIds } from '@/lib/catalog-filter-ids'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { SHOWCASE_WORKS } from '@/lib/works-showcase-data'

const seedByKey = new Map<string, ShowcaseWork>(
  SHOWCASE_WORKS.flatMap((work) => [
    [work.slug, work],
    [work.id, work],
  ]),
)

function isLegacyArchitectureRow(row: ShowcaseWork): boolean {
  const ids = row.filterIds ?? []
  const hadLegacy = ids.some((id) =>
    (LEGACY_CATALOG_FILTER_IDS as readonly string[]).includes(id),
  )
  return hadLegacy && !row.cardSummary?.trim()
}

function enrichWorkRow(row: ShowcaseWork): ShowcaseWork {
  const seed = seedByKey.get(row.slug) ?? seedByKey.get(row.id)
  const filterIds = migrateCatalogFilterIds(row.filterIds)
  if (!seed) {
    return { ...row, filterIds }
  }
  return {
    ...row,
    filterIds,
    cardSummary: row.cardSummary?.trim() || seed.cardSummary,
    category: row.cardSummary?.trim() ? row.category : seed.category,
  }
}

function mergeWorksFromApi(rows: ShowcaseWork[]): ShowcaseWork[] {
  if (rows.length === 0) return [...SHOWCASE_WORKS]
  if (rows.every(isLegacyArchitectureRow)) return [...SHOWCASE_WORKS]
  return rows.map(enrichWorkRow)
}

export function useWorksShowcaseMerged(): ShowcaseWork[] {
  const [works, setWorks] = React.useState<ShowcaseWork[]>(() => [...SHOWCASE_WORKS])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/work-rows', { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { rows?: ShowcaseWork[] }
        if (cancelled) return
        if (Array.isArray(json.rows)) setWorks(mergeWorksFromApi(json.rows))
      } catch {
        // Keep seed fallback.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return works
}
