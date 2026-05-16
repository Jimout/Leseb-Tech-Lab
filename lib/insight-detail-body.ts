import { deriveInsightToc, type InsightArticle, type InsightTocItem } from '@/lib/insight-types'
import { INSIGHT_BODY_ANCHOR, enrichInsightSimpleHtmlWithToc } from '@/lib/insight-simple-html-toc'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { isInsightHtmlEmpty, sanitizeInsightHtml } from '@/lib/sanitize-insight-html'

export type ResolvedInsightBody =
  | { kind: 'structured'; article: InsightArticle; toc: InsightTocItem[] }
  | { kind: 'simple'; html: string; toc: InsightTocItem[] }
  | { kind: 'description'; html: string; toc: InsightTocItem[] }

function descriptionToBodyHtml(description: string): string {
  const trimmed = description.trim()
  if (!trimmed) return ''
  const paragraphs = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  if (paragraphs.length <= 1) {
    return `<div id="${INSIGHT_BODY_ANCHOR}"><p>${escapeHtml(paragraphs[0] ?? trimmed)}</p></div>`
  }
  return `<div id="${INSIGHT_BODY_ANCHOR}">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Pick the best available body for the detail page (DB fields first, then card description). */
export function resolveInsightBody(detail: InsightDetail): ResolvedInsightBody | null {
  const sections = detail.article?.sections
  if (sections?.length) {
    return {
      kind: 'structured',
      article: detail.article!,
      toc: deriveInsightToc(detail.article!),
    }
  }

  const simpleRaw = detail.simpleBodyHtml
  if (simpleRaw && !isInsightHtmlEmpty(simpleRaw)) {
    const safe = sanitizeInsightHtml(simpleRaw)
    const { html, toc } = enrichInsightSimpleHtmlWithToc(safe)
    return { kind: 'simple', html, toc }
  }

  const description = detail.description?.trim() ?? ''
  if (description) {
    return {
      kind: 'description',
      html: descriptionToBodyHtml(description),
      toc: [{ id: INSIGHT_BODY_ANCHOR, label: 'Overview' }],
    }
  }

  return null
}

export function insightHasExtendedBody(detail: InsightDetail): boolean {
  const body = resolveInsightBody(detail)
  return body?.kind === 'structured' || body?.kind === 'simple'
}
