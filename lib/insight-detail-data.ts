import type { InsightDetail } from '@/lib/insight-detail-types'
import { resolveInsightDetailFromShowcaseRow } from '@/lib/insight-detail-resolve'
import { getInsightsFromDb } from '@/lib/insights-db'
import { SHOWCASE_INSIGHTS, type ShowcaseInsight } from '@/lib/insights-showcase-data'
import { resolveInsightRedirectSlug } from '@/lib/slug-service'

export type { InsightDetail } from '@/lib/insight-detail-types'

export type {
  InsightArticle,
  InsightSection,
  InsightSectionBlock,
  InsightTocItem,
} from '@/lib/insight-types'

export {
  buildBaselineInsightDetail,
  resolveInsightDetailFromShowcaseRow,
} from '@/lib/insight-detail-resolve'

function findShowcaseInsightBySlug(slug: string): ShowcaseInsight | undefined {
  return SHOWCASE_INSIGHTS.find((i) => i.slug === slug || i.id === slug)
}

export async function getInsightDetailBySlug(slug: string): Promise<InsightDetail | null> {
  const rows = await getInsightsFromDb()
  const row = rows.find((i) => i.slug === slug) ?? findShowcaseInsightBySlug(slug)
  if (!row) return null
  return resolveInsightDetailFromShowcaseRow(row)
}

export async function getAllInsightSlugs(): Promise<string[]> {
  const rows = await getInsightsFromDb()
  if (rows.length > 0) return rows.map((i) => i.slug)
  return SHOWCASE_INSIGHTS.map((i) => i.slug)
}

/** Resolve canonical slug via SlugHistory; use for OG metadata without emitting a redirect context. */
export async function canonicalInsightSlugForRequestSlug(slug: string): Promise<string> {
  try {
    const next = await resolveInsightRedirectSlug(slug)
    return next ?? slug
  } catch {
    return slug
  }
}
