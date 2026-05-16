import type { InsightDetail } from '@/lib/insight-detail-types'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

export function mergeInsightDetailRow(
  base: InsightDetail,
  row: ShowcaseInsight,
): InsightDetail {
  return {
    ...base,
    ...row,
    href: row.href || base.href,
    article: row.article ?? base.article,
    simpleBodyHtml: row.simpleBodyHtml ?? base.simpleBodyHtml,
    bodyMode: row.bodyMode ?? base.bodyMode,
  }
}
