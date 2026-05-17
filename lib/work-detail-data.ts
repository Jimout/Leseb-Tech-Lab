import { SHOWCASE_WORKS, type ShowcaseWork } from '@/lib/works-showcase-data'
import type { WorkRow } from '@/lib/work-admin-types'
import { resolveWorkDetailFromShowcase } from '@/lib/work-detail-resolve'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { getWorkRowsFromDb } from '@/lib/work-rows-db'
import { resolveWorkRedirectSlug } from '@/lib/slug-service'

export type { ResolvedWorkDetail } from '@/lib/work-detail-types'

export { defaultBodyForWork, resolveWorkDetailFromShowcase } from '@/lib/work-detail-resolve'

type Override = Partial<
  Pick<
    ResolvedWorkDetail,
    | 'pageTitle'
    | 'pageTitleLines'
    | 'year'
    | 'tags'
    | 'projectType'
    | 'roles'
    | 'body'
    | 'additionalImages'
    | 'secondaryHeroImage'
    | 'descriptionNote'
    | 'descriptionBelowImages'
    | 'secondaryImageDescriptionColumns'
    | 'contentBlocks'
    | 'websiteUrl'
  >
>

const OVERRIDES: Partial<Record<string, Override>> = {}

function stripWorkRowToShowcase(row: WorkRow): ShowcaseWork {
  const { detail: _d, ...card } = row
  return card
}

function mergeRowOnResolved(base: ResolvedWorkDetail, row: WorkRow): ResolvedWorkDetail {
  const work = stripWorkRowToShowcase(row)
  if (!row.detail) return { ...base, work, location: work.location }
  const d = row.detail
  const l1 = d.pageTitleLine1?.trim()
  const l2 = d.pageTitleLine2?.trim()
  return {
    ...base,
    work,
    location: work.location,
    pageTitle: l1 && l2 ? `${l1} — ${l2}` : d.pageTitle?.trim() || base.pageTitle,
    pageTitleLines: l1 && l2 ? ([l1, l2] as const) : base.pageTitleLines,
    year: d.year?.trim() || base.year,
    tags: d.tags ?? base.tags,
    projectType: d.projectType?.trim() || base.projectType,
    roles: d.roles ?? base.roles,
    body: d.body ?? base.body,
    descriptionNote: d.descriptionNote ?? base.descriptionNote,
    secondaryHeroImage:
      d.secondaryHeroImage === null
        ? undefined
        : d.secondaryHeroImage !== undefined
          ? d.secondaryHeroImage
          : base.secondaryHeroImage,
    additionalImages: d.additionalImages ?? base.additionalImages,
    descriptionBelowImages: d.descriptionBelowImages ?? base.descriptionBelowImages,
    secondaryImageDescriptionColumns:
      d.secondaryImageDescriptionColumns && d.secondaryImageDescriptionColumns.length > 0
        ? d.secondaryImageDescriptionColumns
        : base.secondaryImageDescriptionColumns,
    contentBlocks:
      d.contentBlocks && d.contentBlocks.length > 0
        ? d.contentBlocks
        : base.contentBlocks,
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
    storyGalleryImages:
      d.storyGalleryImages && d.storyGalleryImages.length > 0
        ? d.storyGalleryImages
        : base.storyGalleryImages,
    storyGalleryTitle: d.storyGalleryTitle?.trim() || base.storyGalleryTitle,
    storyGalleryDescription: d.storyGalleryDescription?.trim() || base.storyGalleryDescription,
  }
}

function findShowcaseWorkBySlug(slug: string): ShowcaseWork | undefined {
  return SHOWCASE_WORKS.find((w) => w.slug === slug || w.id === slug)
}

export async function getWorkDetailBySlug(slug: string): Promise<ResolvedWorkDetail | null> {
  const rows = await getWorkRowsFromDb()
  const row = rows.find((w) => w.slug === slug)
  const showcase = !row ? findShowcaseWorkBySlug(slug) : undefined
  const work = row ? stripWorkRowToShowcase(row) : showcase
  if (!work) return null

  const o = OVERRIDES[work.slug] ?? OVERRIDES[work.id]
  const base = resolveWorkDetailFromShowcase(work)
  const resolvedFromOverrides = !o
    ? base
    : {
        ...base,
        pageTitle: o.pageTitle ?? base.pageTitle,
        pageTitleLines: o.pageTitleLines ?? base.pageTitleLines,
        year: o.year ?? base.year,
        tags: o.tags?.length ? o.tags : base.tags,
        projectType: o.projectType ?? base.projectType,
        roles: o.roles?.length ? [...o.roles] : base.roles,
        body: o.body ?? base.body,
        additionalImages: o.additionalImages,
        secondaryHeroImage: o.secondaryHeroImage,
        descriptionNote: o.descriptionNote,
        descriptionBelowImages: o.descriptionBelowImages,
        secondaryImageDescriptionColumns: o.secondaryImageDescriptionColumns,
        websiteUrl: o.websiteUrl ?? base.websiteUrl,
      }

  if (!row) return resolvedFromOverrides
  return mergeRowOnResolved(resolvedFromOverrides, row)
}

export async function getAllWorkSlugs(): Promise<string[]> {
  const rows = await getWorkRowsFromDb()
  if (rows.length > 0) return rows.map((w) => w.slug)
  return SHOWCASE_WORKS.map((w) => w.slug)
}

export async function canonicalWorkSlugForRequestSlug(slug: string): Promise<string> {
  const next = await resolveWorkRedirectSlug(slug)
  return next ?? slug
}
