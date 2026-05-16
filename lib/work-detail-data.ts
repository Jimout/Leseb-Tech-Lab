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
  >
>

const OVERRIDES: Partial<Record<string, Override>> = {
  'arch-community-residence': {
    secondaryHeroImage: {
      src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=80',
      alt: 'Residential project exterior at dusk with warm interior lighting',
    },
    additionalImages: [
      {
        src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
        alt: 'Modern residential facade with landscaping and warm evening light',
      },
    ],
    secondaryImageDescriptionColumns: [
      'For the Ethiopian Investment Holdings Headquarters, we led the landscape design and site planning, integrating parking and outdoor spaces with the natural terrain and nearby river. We designed walkable paths to enhance circulation, selected indigenous, edible, and fragrant plants like lavender along lounge areas, and ensured the landscape emphasized flow, accessibility, and sensory experience.',
      'For the Ethiopian Investment Holdings Headquarters, we led the landscape design and site planning, integrating parking and outdoor spaces with the natural terrain and nearby river. We designed walkable paths to enhance circulation, selected indigenous, edible, and fragrant plants like lavender along lounge areas, and ensured the landscape emphasized flow, accessibility, and sensory experience.',
      'For the Ethiopian Investment Holdings Headquarters, we led the landscape design and site planning, integrating parking and outdoor spaces with the natural terrain and nearby river. We designed walkable paths to enhance circulation, selected indigenous, edible, and fragrant plants like lavender along lounge areas, and ensured the landscape emphasized flow, accessibility, and sensory experience.',
      'For the Ethiopian Investment Holdings Headquarters, we led the landscape design and site planning, integrating parking and outdoor spaces with the natural terrain and nearby river. We designed walkable paths to enhance circulation, selected indigenous, edible, and fragrant plants like lavender along lounge areas, and ensured the landscape emphasized flow, accessibility, and sensory experience.',
    ],
  },
  'eih-landscape': {
    pageTitle: 'Ethiopian Investment Holdings Head Quarter Landscape',
    pageTitleLines: ['Ethiopian Investment Holdings', 'Head Quarter Landscape'],
    descriptionNote:
      'For the Ethiopian Investment Holdings Headquarters, we led the landscape design and site planning, integrating parking and outdoor spaces with the natural terrain and nearby river. We designed walkable paths to enhance circulation, selected indigenous, edible, and fragrant plants like lavender along lounge areas, and ensured the landscape emphasized flow, accessibility, and sensory experience.',
    descriptionBelowImages: [
      {
        src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80',
        alt: 'Urban plaza with trees and pedestrian circulation near a headquarters complex',
      },
      {
        src: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2000&q=80',
        alt: 'Landscape path and green corridor along a water edge',
      },
    ],
    year: '2025',
    tags: ['Landscape Design', '3D Modeling', 'Visualization'],
    projectType: 'Office Architecture',
    roles: ['Lead Landscape Designer', 'Architectural Visualizer'],
    body:
      'The landscape strategy weaves parking, circulation, and river-edge planting into one coherent ground plane. Layered green buffers soften the approach to the headquarters, while long sightlines and durable paving keep daily operations clear and legible. The proposal balances regulatory requirements with a calm, planted character that reads from both aerial and pedestrian scales.',
    additionalImages: [
      {
        src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1400&q=80',
        alt: 'Ground level view of the headquarters building with landscaping',
      },
    ],
  },
}

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
