export type InsightTocItem = { id: string; label: string }

export type InsightSectionBlock =
  | { type: 'p'; html: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }

export type InsightSection = {
  id: string
  heading: string
  blocks: InsightSectionBlock[]
}

export type InsightArticle = {
  /** Optional explicit TOC order; otherwise derived from `sections`. */
  toc?: InsightTocItem[]
  sections: InsightSection[]
}

export function deriveInsightToc(article: InsightArticle): InsightTocItem[] {
  if (article.toc?.length) return article.toc
  return article.sections.map((s) => ({ id: s.id, label: s.heading }))
}
