import { SHOWCASE_WORKS } from '@/lib/works-showcase-data'
import type { WorkRow } from '@/lib/work-admin-types'
import { resolveWorkDetailFromShowcase } from '@/lib/work-detail-resolve'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'

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

function findShowcaseWorkBySlug(slug: string) {
  return SHOWCASE_WORKS.find((w) => w.slug === slug || w.id === slug)
}

export async function getWorkDetailBySlug(slug: string): Promise<ResolvedWorkDetail | null> {
  const work = findShowcaseWorkBySlug(slug)
  if (!work) return null

  const o = OVERRIDES[work.slug] ?? OVERRIDES[work.id]
  const base = resolveWorkDetailFromShowcase(work)
  if (!o) return base

  return {
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
}

export async function getAllWorkSlugs(): Promise<string[]> {
  return SHOWCASE_WORKS.map((w) => w.slug)
}

export async function canonicalWorkSlugForRequestSlug(slug: string): Promise<string> {
  return slug
}
