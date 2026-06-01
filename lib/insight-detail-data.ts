import type { InsightDetail } from '@/lib/insight-detail-types'
import { resolveInsightDetailFromShowcaseRow } from '@/lib/insight-detail-resolve'
import { SHOWCASE_INSIGHTS, type ShowcaseInsight } from '@/lib/insights-showcase-data'

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
  const row = findShowcaseInsightBySlug(slug)
  if (!row) return null
  return resolveInsightDetailFromShowcaseRow(row)
}

export async function getAllInsightSlugs(): Promise<string[]> {
  return SHOWCASE_INSIGHTS.map((i) => i.slug)
}

export async function canonicalInsightSlugForRequestSlug(slug: string): Promise<string> {
  return slug
}
