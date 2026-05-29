import type { InsightRow } from '@/components/admin/insights/admin-insight-fields'
import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'
import { insightHref, type InsightBodyMode } from '@/lib/insights-showcase-data'
import { slugifyTitle } from '@/lib/slug-format'
import type { InsightArticle } from '@/lib/insight-types'

function defaultArticle(): InsightArticle {
  return {
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        blocks: [{ type: 'p', html: '<p></p>' }],
      },
    ],
  }
}

export function buildInsightPayload(row: InsightRow): InsightRow | null {
  if (!String(row.title || '').trim()) return null

  const id = String(row.id || '').trim()
  const slug = slugifyTitle(String(row.slug || '').trim() || row.title)
  const mode: InsightBodyMode = row.bodyMode ?? 'simple'

  const base: InsightRow = {
    id,
    publicId: row.publicId,
    slug,
    href: insightHref(slug),
    date: row.date,
    dateIso: row.dateIso,
    title: row.title,
    description: row.description,
    heroMedia: row.heroMedia,
    mediaAssets: row.mediaAssets,
    filterIds: [...row.filterIds],
    bodyMode: mode,
  }

  if (mode === 'structured') {
    return { ...base, article: row.article ?? defaultArticle() }
  }

  if (isInsightHtmlEmpty(row.simpleBodyHtml)) {
    return { ...base }
  }

  return { ...base, simpleBodyHtml: row.simpleBodyHtml ?? '<p></p>' }
}

export function insightRowSnapshot(row: InsightRow): string {
  const payload = buildInsightPayload(row)
  return JSON.stringify(payload ?? {})
}
