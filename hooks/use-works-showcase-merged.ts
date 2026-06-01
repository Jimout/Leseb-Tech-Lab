'use client'

import * as React from 'react'

import { LEGACY_CATALOG_FILTER_IDS, migrateCatalogFilterIds } from '@/lib/catalog-filter-ids'
import { readWorkRowsFromStorage } from '@/lib/frontend-content'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { SHOWCASE_WORKS } from '@/lib/works-showcase-data'
import type { WorkRow } from '@/lib/work-admin-types'

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

function stripWorkRowToShowcase(row: WorkRow): ShowcaseWork {
  const { detail: _d, ...card } = row
  return card
}

function mergeWorksFromStorage(rows: WorkRow[]): ShowcaseWork[] {
  if (rows.length === 0) return [...SHOWCASE_WORKS]
  if (rows.every((row) => isLegacyArchitectureRow(stripWorkRowToShowcase(row)))) {
    return [...SHOWCASE_WORKS]
  }
  return rows.map((row) => enrichWorkRow(stripWorkRowToShowcase(row)))
}

export function useWorksShowcaseMerged(): ShowcaseWork[] {
  const [works, setWorks] = React.useState<ShowcaseWork[]>(() => [...SHOWCASE_WORKS])

  React.useEffect(() => {
    setWorks(mergeWorksFromStorage(readWorkRowsFromStorage()))
  }, [])

  return works
}
