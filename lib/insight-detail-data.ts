import type { InsightDetail } from '@/lib/insight-detail-types'
import { resolveInsightDetailFromShowcaseRow } from '@/lib/insight-detail-resolve'
import { getInsightsFromDb } from '@/lib/insights-db'
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

export async function getInsightDetailBySlug(slug: string): Promise<InsightDetail | null> {
  const rows = await getInsightsFromDb()
  const row = rows.find((i) => i.slug === slug)
  if (!row) return null
  return resolveInsightDetailFromShowcaseRow(row)
}

export async function getAllInsightSlugs(): Promise<string[]> {
  const rows = await getInsightsFromDb()
  return rows.map((i) => i.slug)
}

/** Resolve canonical slug via SlugHistory; use for OG metadata without emitting a redirect context. */
export async function canonicalInsightSlugForRequestSlug(slug: string): Promise<string> {
  const next = await resolveInsightRedirectSlug(slug)
  return next ?? slug
}
