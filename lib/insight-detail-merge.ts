import type { InsightDetail } from '@/lib/insight-detail-types'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'

export function mergeInsightDetailRow(
  base: InsightDetail,
  row: ShowcaseInsight,
): InsightDetail {
  const structured = Boolean(row.article?.sections?.length)
  const simple = Boolean(row.simpleBodyHtml && !isInsightHtmlEmpty(row.simpleBodyHtml))

  return {
    ...base,
    ...row,
    paragraphs: base.paragraphs,
    href: row.href || base.href,
    article: structured ? row.article : simple ? undefined : base.article,
    simpleBodyHtml: simple && !structured ? row.simpleBodyHtml : undefined,
  }
}
