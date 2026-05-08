import { BIOMIMICRY_ARTICLE } from '@/lib/insight-article-biomimicry'
import { mergeInsightDetailRow } from '@/lib/insight-detail-merge'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { insightHref, type ShowcaseInsight } from '@/lib/insights-showcase-data'

const BIOMIMICRY_BODY: readonly string[] = [
  'Biomimicry looks past surface aesthetics and asks how organisms regulate temperature, manage water, and distribute load. In architecture, that translates into envelopes that breathe, structures that follow stress paths, and facades that respond to sun and wind rather than fighting them.',
  'The goal is not to copy organic shapes for novelty, but to import the logic: hierarchy of structure, redundancy without waste, and adaptation over time. A wall can behave like a membrane; a roof can behave like a leaf—modulating light and shedding heat.',
  'Visualization plays a decisive role. When clients can read performance alongside form—thermal gradients, daylight penetration, airflow—design moves from metaphor to measurable intent. The image becomes evidence, not decoration.',
  'Looking forward, the studio continues to pair analog craft with digital simulation: quick physical models, iterative renders, and diagrams that stay legible in review. Nature remains the reference library; design is how we translate it into built reality.',
]

const EXTRA_PARAGRAPHS: Partial<Record<string, readonly string[]>> = {
  'biomimicry-architecture': BIOMIMICRY_BODY,
}

function defaultParagraphs(description: string, title: string): readonly string[] {
  return [
    description,
    `This note expands on how ${title.split(':')[0]?.trim() ?? 'the topic'} shows up in current projects—from early diagrams through visualization.`,
    'For more writing on architecture, visualization, and process, return to the insights index.',
  ]
}

/** Baseline detail before applying stored body fields (simple HTML / structured article). */
export function buildBaselineInsightDetail(row: ShowcaseInsight): InsightDetail {
  const paragraphs = EXTRA_PARAGRAPHS[row.id] ?? defaultParagraphs(row.description, row.title)
  const article = row.id === 'biomimicry-architecture' ? BIOMIMICRY_ARTICLE : undefined
  return {
    ...row,
    href: row.href || insightHref(row.id),
    paragraphs,
    article,
    simpleBodyHtml: undefined,
  }
}

/** Full detail for a showcase row (used server-side and after client fetch). */
export function resolveInsightDetailFromShowcaseRow(row: ShowcaseInsight): InsightDetail {
  return mergeInsightDetailRow(buildBaselineInsightDetail(row), row)
}
