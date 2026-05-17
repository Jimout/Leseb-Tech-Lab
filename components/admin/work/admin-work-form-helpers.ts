import { emptyWorkDetail } from '@/components/admin/work/admin-work-fields'
import {
  deriveBlocksFromLegacy,
  normalizeWorkDetailContentBlocks,
} from '@/lib/work-detail-content-blocks'
import type { WorkDetailPatch, WorkRow } from '@/lib/work-admin-types'

export function mergeInitialDetail(d?: WorkDetailPatch): WorkDetailPatch {
  const base = emptyWorkDetail()
  if (!d) return base

  const contentBlocks = d.contentBlocks?.length
    ? normalizeWorkDetailContentBlocks(d.contentBlocks)
    : deriveBlocksFromLegacy(d)

  return {
    ...base,
    descriptionNote: d.descriptionNote ?? '',
    websiteUrl: d.websiteUrl ?? '',
    client: d.client ?? '',
    industry: d.industry?.trim() || d.projectType?.trim() || '',
    duration: d.duration?.trim() || d.solution?.trim() || '',
    storyVideo: d.storyVideo,
    storyVideoTitle: d.storyVideoTitle ?? '',
    storyVideoDescription: d.storyVideoDescription ?? '',
    storyGalleryImages: d.storyGalleryImages ?? [],
    storyGalleryTitle: d.storyGalleryTitle ?? '',
    storyGalleryDescription: d.storyGalleryDescription ?? '',
    contentBlocks,
  }
}

function compactDetailForStorage(d: WorkDetailPatch): WorkDetailPatch | undefined {
  const out: WorkDetailPatch = {}
  const contentBlocks = normalizeWorkDetailContentBlocks(d.contentBlocks)

  const strKeys = [
    'descriptionNote',
    'websiteUrl',
    'client',
    'industry',
    'duration',
  ] as const

  for (const k of strKeys) {
    const v = d[k]
    if (typeof v === 'string' && v.trim()) out[k] = v.trim()
  }

  if (d.storyVideo?.url?.trim()) {
    out.storyVideo = {
      type: 'video',
      url: d.storyVideo.url.trim(),
      alt: d.storyVideo.alt?.trim() || '',
    }
  }

  if (contentBlocks.length) {
    out.contentBlocks = contentBlocks
  } else {
    const legacyKeys = [
      'storyVideoTitle',
      'storyVideoDescription',
      'storyGalleryTitle',
      'storyGalleryDescription',
    ] as const
    for (const k of legacyKeys) {
      const v = d[k]
      if (typeof v === 'string' && v.trim()) out[k] = v.trim()
    }
    const storyGalleryImages = (d.storyGalleryImages ?? []).filter((x) => x.src.trim())
    if (storyGalleryImages.length) out.storyGalleryImages = storyGalleryImages
  }

  if (Object.keys(out).length === 0) return undefined
  return out
}

export function buildWorkPayload(row: WorkRow): WorkRow {
  const id = String(row.id || '').trim()
  const slug = String(row.slug || '').trim()
  const detail = compactDetailForStorage(row.detail ?? emptyWorkDetail())

  return {
    id,
    publicId: row.publicId,
    slug,
    heroMedia: row.heroMedia,
    mediaAssets: row.mediaAssets,
    year: row.year,
    location: row.location,
    title: row.title,
    category: row.category,
    cardSummary: row.cardSummary?.trim() ?? '',
    filterIds: [...row.filterIds],
    detail,
  }
}

export function workRowSnapshot(row: WorkRow): string {
  return JSON.stringify(buildWorkPayload(row))
}
