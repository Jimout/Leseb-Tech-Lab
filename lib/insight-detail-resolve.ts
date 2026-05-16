import { applyInsightDemoBody } from '@/lib/insights-demo-body'
import { mergeInsightDetailRow } from '@/lib/insight-detail-merge'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { insightHref, type ShowcaseInsight } from '@/lib/insights-showcase-data'

/** Baseline detail before applying stored body fields (simple HTML / structured article). */
export function buildBaselineInsightDetail(row: ShowcaseInsight): InsightDetail {
  return {
    ...row,
    href: row.href || insightHref(row.slug),
  }
}

/** Full detail for a showcase row (used server-side and after client fetch). */
export function resolveInsightDetailFromShowcaseRow(row: ShowcaseInsight): InsightDetail {
  const enriched = applyInsightDemoBody(row)
  return mergeInsightDetailRow(buildBaselineInsightDetail(enriched), enriched)
}
