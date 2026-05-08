import type { InsightArticle } from '@/lib/insight-types'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

export type InsightDetail = ShowcaseInsight & {
  paragraphs: readonly string[]
  /** When set, renders TOC + sidebar + structured sections instead of flat paragraphs. */
  article?: InsightArticle
}
