import { resolveWorkDetailFromShowcase } from '@/lib/work-detail-resolve'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import type { WorkDetailPatch, WorkRow } from '@/lib/work-admin-types'

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (value === undefined) return fallback
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function asMediaArray(
  value: unknown,
  fallback: Array<{ src: string; alt: string }> | undefined,
): Array<{ src: string; alt: string }> | undefined {
  if (value === undefined) return fallback
  if (!Array.isArray(value)) return undefined
  const normalized = value.filter(
    (item): item is { src: string; alt: string } =>
      Boolean(
        item &&
          typeof item === 'object' &&
          typeof (item as { src?: unknown }).src === 'string' &&
          typeof (item as { alt?: unknown }).alt === 'string',
      ),
  )
  return normalized.length > 0 ? normalized : undefined
}

function asContentBlocks<T>(value: unknown, fallback: T[] | undefined): T[] | undefined {
  if (value === undefined) return fallback
  if (!Array.isArray(value)) return undefined
  return value.length ? (value as T[]) : undefined
}

/**
 * `cardDefaults` comes from the current listing row (`resolveWorkDetailFromShowcase(work)`) so title, year,
 * tags, and location track the card when detail omits overrides.
 */
function mergePatch(
  base: ResolvedWorkDetail,
  d: WorkDetailPatch,
  cardDefaults: ResolvedWorkDetail,
): Omit<ResolvedWorkDetail, 'work'> {
  const l1 = d.pageTitleLine1?.trim()
  const l2 = d.pageTitleLine2?.trim()
  const pageTitleLines = l1 && l2 ? ([l1, l2] as const) : base.pageTitleLines
  const pageTitle =
    l1 && l2 ? `${l1} — ${l2}` : d.pageTitle?.trim() || cardDefaults.pageTitle

  const year = d.year?.trim() || cardDefaults.year

  return {
    pageTitle,
    pageTitleLines,
    year,
    location: cardDefaults.location,
    tags: asStringArray(d.tags, cardDefaults.tags),
    projectType: d.projectType?.trim() || base.projectType,
    roles: asStringArray(d.roles, base.roles),
    body: d.body !== undefined ? d.body : base.body,
    descriptionNote:
      d.descriptionNote !== undefined ? d.descriptionNote : base.descriptionNote,
    secondaryHeroImage:
      d.secondaryHeroImage === null
        ? undefined
        : d.secondaryHeroImage !== undefined
          ? d.secondaryHeroImage
          : base.secondaryHeroImage,
    additionalImages: asMediaArray(d.additionalImages, base.additionalImages),
    descriptionBelowImages: asMediaArray(
      d.descriptionBelowImages,
      base.descriptionBelowImages as Array<{ src: string; alt: string }> | undefined,
    ),
    secondaryImageDescriptionColumns: asContentBlocks<string>(
      d.secondaryImageDescriptionColumns,
      base.secondaryImageDescriptionColumns as string[] | undefined,
    ),
    contentBlocks: asContentBlocks(d.contentBlocks, base.contentBlocks as typeof d.contentBlocks),
    websiteUrl: d.websiteUrl?.trim() || base.websiteUrl,
    client: d.client?.trim() || base.client,
    industry: d.industry?.trim() || d.projectType?.trim() || base.industry,
    duration: d.duration?.trim() || d.solution?.trim() || base.duration,
    storyVideo:
      d.storyVideo === null
        ? null
        : d.storyVideo?.url?.trim()
          ? d.storyVideo
          : base.storyVideo,
    storyVideoTitle: d.storyVideoTitle?.trim() || base.storyVideoTitle,
    storyVideoDescription: d.storyVideoDescription?.trim() || base.storyVideoDescription,
    storyGalleryImages: asMediaArray(
      d.storyGalleryImages,
      base.storyGalleryImages as Array<{ src: string; alt: string }> | undefined,
    ),
    storyGalleryTitle: d.storyGalleryTitle?.trim() || base.storyGalleryTitle,
    storyGalleryDescription: d.storyGalleryDescription?.trim() || base.storyGalleryDescription,
  }
}

export function mergeWorkDetailRow(
  base: ResolvedWorkDetail,
  row: WorkRow,
): ResolvedWorkDetail {
  const work: ResolvedWorkDetail['work'] = {
    id: row.id,
    publicId: row.publicId,
    slug: row.slug,
    heroMedia: row.heroMedia,
    mediaAssets: row.mediaAssets,
    year: row.year,
    location: row.location,
    title: row.title,
    category: row.category,
    filterIds: row.filterIds,
  }

  const cardDefaults = resolveWorkDetailFromShowcase(work)

  if (!row.detail) {
    return {
      ...base,
      work,
      pageTitle: cardDefaults.pageTitle,
      pageTitleLines: cardDefaults.pageTitleLines,
      year: cardDefaults.year,
      tags: cardDefaults.tags,
      location: work.location,
      client: cardDefaults.client,
      industry: cardDefaults.industry,
      duration: cardDefaults.duration,
      storyVideo: cardDefaults.storyVideo,
      storyVideoTitle: cardDefaults.storyVideoTitle,
      storyVideoDescription: cardDefaults.storyVideoDescription,
      storyGalleryImages: cardDefaults.storyGalleryImages,
      storyGalleryTitle: cardDefaults.storyGalleryTitle,
      storyGalleryDescription: cardDefaults.storyGalleryDescription,
    }
  }

  const merged = mergePatch(base, row.detail, cardDefaults)
  return { work, ...merged, location: work.location }
}
