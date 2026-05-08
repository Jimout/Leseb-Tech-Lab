import type { ShowcaseWork } from '@/lib/works-showcase-data'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'

export type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'

/** Optional overrides for `/work/[slug]` — stored with the card in localStorage. */
export type WorkDetailPatch = {
  pageTitle?: string
  pageTitleLine1?: string
  pageTitleLine2?: string
  /** Overrides card year in the meta bar when set */
  year?: string
  tags?: string[]
  projectType?: string
  roles?: string[]
  body?: string
  descriptionNote?: string
  /** `null` removes the block */
  secondaryHeroImage?: { src: string; alt: string; publicId?: string } | null
  additionalImages?: Array<{ src: string; alt: string; publicId?: string }>
  descriptionBelowImages?: Array<{ src: string; alt: string; publicId?: string }>
  /** Four paragraphs in a 2×2 grid under the secondary hero image */
  secondaryImageDescriptionColumns?: string[]
  /** Ordered rich text + images below the meta bar. When present and non-empty, replaces legacy layout fields. */
  contentBlocks?: WorkDetailContentBlock[]
}

export type WorkRow = ShowcaseWork & {
  detail?: WorkDetailPatch
}

export function stripWorkRowToShowcase(row: WorkRow): ShowcaseWork {
  const { detail: _d, ...card } = row
  return card
}
