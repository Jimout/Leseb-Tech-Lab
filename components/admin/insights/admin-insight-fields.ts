import type { Field } from '@/components/admin/simple-form'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

export type InsightRow = ShowcaseInsight

export function emptyInsight(): InsightRow {
  return {
    id: '',
    publicId: '',
    slug: '',
    date: '',
    dateIso: '',
    title: '',
    description: '',
    heroMedia: null,
    mediaAssets: [],
    href: '',
    filterIds: [],
    bodyMode: 'simple',
    simpleBodyHtml: '<p></p>',
  }
}

/** Legacy simple form fields — kept for reference; full editor uses `AdminInsightFormPage`. */
export const insightFields: readonly Field[] = [
  { key: 'id', label: 'Slug / id', kind: 'text', placeholder: 'biomimicry-architecture' },
  { key: 'title', label: 'Title', kind: 'text' },
  { key: 'date', label: 'Date (display)', kind: 'text', placeholder: 'March 14, 2026' },
  { key: 'dateIso', label: 'Date ISO', kind: 'text', placeholder: '2026-03-14' },
  { key: 'description', label: 'Description', kind: 'textarea', rows: 4 },
] as const
