'use client'

import * as React from 'react'

import { LEGACY_CATALOG_FILTER_IDS, migrateCatalogFilterIds } from '@/lib/catalog-filter-ids'
import { readInsightsFromStorage } from '@/lib/frontend-content'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { SHOWCASE_INSIGHTS } from '@/lib/insights-showcase-data'

const seedByKey = new Map<string, ShowcaseInsight>(
  SHOWCASE_INSIGHTS.flatMap((insight) => [
    [insight.slug, insight],
    [insight.id, insight],
  ]),
)

function isLegacyArchitectureInsight(row: ShowcaseInsight): boolean {
  const ids = row.filterIds ?? []
  const hadLegacy = ids.some((id) =>
    (LEGACY_CATALOG_FILTER_IDS as readonly string[]).includes(id),
  )
  const hasBody =
    Boolean(row.article?.sections?.length) ||
    Boolean(row.simpleBodyHtml?.trim())
  return hadLegacy && !hasBody
}

function enrichInsightRow(row: ShowcaseInsight): ShowcaseInsight {
  const seed = seedByKey.get(row.slug) ?? seedByKey.get(row.id)
  const filterIds = migrateCatalogFilterIds(row.filterIds)
  if (!seed) {
    return { ...row, filterIds }
  }
  return {
    ...row,
    filterIds,
    description: row.description?.trim() || seed.description,
    heroMedia: row.heroMedia ?? seed.heroMedia,
    mediaAssets: row.mediaAssets?.length ? row.mediaAssets : seed.mediaAssets,
  }
}

function mergeInsightsFromStorage(rows: ShowcaseInsight[]): ShowcaseInsight[] {
  if (rows.length === 0) return [...SHOWCASE_INSIGHTS]
  if (rows.length === 1 && (rows[0]?.slug === 'hello' || rows[0]?.slug === 'insight')) {
    return [...SHOWCASE_INSIGHTS]
  }
  if (rows.every(isLegacyArchitectureInsight)) return [...SHOWCASE_INSIGHTS]
  return rows.map(enrichInsightRow)
}

export function useInsightsShowcaseMerged(): ShowcaseInsight[] {
  const [insights, setInsights] = React.useState<ShowcaseInsight[]>(() => [...SHOWCASE_INSIGHTS])

  React.useEffect(() => {
    setInsights(mergeInsightsFromStorage(readInsightsFromStorage()))
  }, [])

  return insights
}
