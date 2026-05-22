import { emptyWorkDetail } from '@/components/admin/work/admin-work-fields'
import { mergeInitialDetail } from '@/components/admin/work/admin-work-form-helpers'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { slugifyTitle } from '@/lib/slug-format'
import type { WorkDetailPatch, WorkRow } from '@/lib/work-admin-types'

export type WorkCreateFormSnapshot = {
  slug: string
  title: string
  year: string
  category: string
  cardSummary: string
  location: string
  heroUrl: string
  heroAlt: string
  filterIds: string[]
  pageTitle: string
  descriptionNote: string
  client: string
  industry: string
  duration: string
  contentBlocks: WorkDetailContentBlock[]
}

export function emptyWorkCreateFormSnapshot(): WorkCreateFormSnapshot {
  return {
    slug: '',
    title: '',
    year: String(new Date().getFullYear()),
    category: '',
    cardSummary: '',
    location: '',
    heroUrl: '',
    heroAlt: '',
    filterIds: [],
    pageTitle: '',
    descriptionNote: '',
    client: '',
    industry: '',
    duration: '',
    contentBlocks: [],
  }
}

export function workCreateFormSnapshot(state: WorkCreateFormSnapshot): WorkCreateFormSnapshot {
  return {
    ...state,
    filterIds: [...state.filterIds],
    contentBlocks: state.contentBlocks.map((b) => ({ ...b })),
  }
}

function detailFromSnapshot(state: WorkCreateFormSnapshot): WorkDetailPatch {
  return mergeInitialDetail({
    pageTitle: state.pageTitle,
    descriptionNote: state.descriptionNote,
    client: state.client,
    industry: state.industry,
    duration: state.duration,
    contentBlocks: state.contentBlocks,
  })
}

export function isWorkCreateFormDirty(state: WorkCreateFormSnapshot): boolean {
  const empty = emptyWorkCreateFormSnapshot()
  if (state.slug.trim()) return true
  if (state.title.trim()) return true
  if (state.year.trim() && state.year !== empty.year) return true
  if (state.category.trim()) return true
  if (state.cardSummary.trim()) return true
  if (state.location.trim()) return true
  if (state.heroUrl.trim()) return true
  if (state.heroAlt.trim()) return true
  if (state.filterIds.length > 0) return true
  if (state.pageTitle.trim()) return true
  if (state.descriptionNote.trim()) return true
  if (state.client.trim()) return true
  if (state.industry.trim()) return true
  if (state.duration.trim()) return true
  if (state.contentBlocks.length > 0) return true
  return false
}

export type WorkCreateValidation = {
  valid: boolean
  missing: string[]
}

export function validateWorkCreateForm(_state: WorkCreateFormSnapshot): WorkCreateValidation {
  return { valid: true, missing: [] }
}

export function buildWorkRowFromCreateForm(state: WorkCreateFormSnapshot): WorkRow {
  const title = state.title.trim()
  const slug = slugifyTitle(state.slug.trim() || title) || 'work'
  const heroMedia = state.heroUrl.trim()
    ? { type: 'image' as const, url: state.heroUrl.trim(), alt: state.heroAlt.trim() || title }
    : null

  const detail = detailFromSnapshot(state)
  const hasDetail = Object.keys(detail).length > 0

  return {
    id: '',
    publicId: '',
    slug,
    title,
    year: state.year.trim(),
    location: state.location.trim(),
    category: state.category.trim(),
    cardSummary: state.cardSummary.trim(),
    filterIds: [...state.filterIds],
    heroMedia,
    mediaAssets: heroMedia ? [heroMedia] : [],
    detail: hasDetail ? detail : undefined,
  }
}

export function snapshotFromDetail(detail: WorkDetailPatch): Pick<
  WorkCreateFormSnapshot,
  'pageTitle' | 'descriptionNote' | 'client' | 'industry' | 'duration' | 'contentBlocks'
> {
  const merged = mergeInitialDetail(detail)
  return {
    pageTitle: merged.pageTitle ?? '',
    descriptionNote: merged.descriptionNote ?? '',
    client: merged.client ?? '',
    industry: merged.industry ?? '',
    duration: merged.duration ?? '',
    contentBlocks: merged.contentBlocks ?? [],
  }
}
