import type { InsightTocItem } from '@/lib/insight-types'

const INSIGHT_BODY_ANCHOR = 'insight-body'

function slugifyHeading(text: string, used: Set<string>): string {
  const base =
    text
      .replace(/<[^>]+>/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  let id = base
  let n = 2
  while (used.has(id)) {
    id = `${base}-${n}`
    n += 1
  }
  used.add(id)
  return id
}

/** Assign heading ids and build TOC entries from admin simple HTML (h2/h3). */
export function enrichInsightSimpleHtmlWithToc(html: string): {
  html: string
  toc: InsightTocItem[]
} {
  const toc: InsightTocItem[] = []
  const used = new Set<string>()

  const enriched = html.replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, attrs: string, inner: string) => {
      const label = inner.replace(/<[^>]+>/g, '').trim()
      if (!label) return _match

      const existingId = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]
      const id = existingId?.trim() || slugifyHeading(label, used)
      if (existingId) used.add(id)

      toc.push({ id, label })
      const attrsWithoutId = attrs.replace(/\s*\bid\s*=\s*["'][^"']*["']/gi, '')
      return `<h${level}${attrsWithoutId} id="${id}">${inner}</h${level}>`
    },
  )

  if (!toc.length && enriched.trim()) {
    return {
      html: `<div id="${INSIGHT_BODY_ANCHOR}">${enriched}</div>`,
      toc: [{ id: INSIGHT_BODY_ANCHOR, label: 'Overview' }],
    }
  }

  return { html: enriched, toc }
}

export { INSIGHT_BODY_ANCHOR }
