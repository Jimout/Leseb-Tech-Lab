import { defaultInsightDates } from '@/lib/admin/insight-form-dates'
import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'

export type InsightCreateFormSnapshot = {
  title: string
  dateIso: string
  description: string
  heroUrl: string
  heroAlt: string
  filterIds: string[]
  bodyHtml: string
}

export function emptyInsightCreateFormSnapshot(): InsightCreateFormSnapshot {
  const dates = defaultInsightDates()
  return {
    title: '',
    dateIso: dates.dateIso,
    description: '',
    heroUrl: '',
    heroAlt: '',
    filterIds: [],
    bodyHtml: '<p></p>',
  }
}

export function isInsightCreateFormDirty(state: InsightCreateFormSnapshot): boolean {
  const empty = emptyInsightCreateFormSnapshot()
  if (state.title.trim()) return true
  if (state.description.trim()) return true
  if (state.heroUrl.trim()) return true
  if (state.heroAlt.trim()) return true
  if (state.filterIds.length > 0) return true
  if (!isInsightHtmlEmpty(state.bodyHtml)) return true
  if (state.dateIso !== empty.dateIso) return true
  return false
}

export type InsightCreateValidation = {
  valid: boolean
  missing: string[]
}

export function validateInsightCreateForm(state: InsightCreateFormSnapshot): InsightCreateValidation {
  const missing: string[] = []
  if (!state.title.trim()) missing.push('Title')
  if (!state.description.trim()) missing.push('Summary')
  if (!state.heroUrl.trim()) missing.push('Hero image')
  if (!state.heroAlt.trim()) missing.push('Hero image alt text')
  if (state.filterIds.length === 0) missing.push('At least one topic')
  if (isInsightHtmlEmpty(state.bodyHtml)) missing.push('Article body')
  return { valid: missing.length === 0, missing }
}

export function insightCreateFormSnapshot(state: {
  title: string
  dateIso: string
  description: string
  heroUrl: string
  heroAlt: string
  filterIds: string[]
  bodyHtml: string
}): InsightCreateFormSnapshot {
  return {
    title: state.title,
    dateIso: state.dateIso,
    description: state.description,
    heroUrl: state.heroUrl,
    heroAlt: state.heroAlt,
    filterIds: state.filterIds,
    bodyHtml: state.bodyHtml,
  }
}
