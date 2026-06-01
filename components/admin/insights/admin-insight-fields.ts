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
