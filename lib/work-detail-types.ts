import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import type { MediaAsset } from '@/lib/media-assets'
import type { ShowcaseWork } from '@/lib/works-showcase-data'

export type ResolvedWorkDetail = {
  work: ShowcaseWork
  /** Page H1 — may be longer than card title */
  pageTitle: string
  /** When set, hero renders two explicit lines (e.g. client name + project). */
  pageTitleLines?: readonly [string, string]
  year: string
  location: string
  tags: string[]
  projectType: string
  roles: string[]
  body: string
  /** Additional images to display below the hero */
  additionalImages?: Array<{ src: string; alt: string }>
  /** Full-width block below metadata — same min-height scale as the main hero image. */
  secondaryHeroImage?: { src: string; alt: string }
  /** Two-column note below the hero image (before metadata). Paragraphs: split with blank lines. */
  descriptionNote?: string
  /** Full-bleed images below the description note — same min-height as main hero (`workDetailMainImageHeightClass`). */
  descriptionBelowImages?: ReadonlyArray<{ src: string; alt: string }>
  /** Four short paragraphs rendered in two columns under the secondary image. */
  secondaryImageDescriptionColumns?: ReadonlyArray<string>
  /** Flexible body: rich + images in order. When set and non-empty, legacy below-meta fields are ignored. */
  contentBlocks?: ReadonlyArray<WorkDetailContentBlock>
  /** When set, a fixed “Visit website” button stays at the bottom of the viewport while scrolling. */
  websiteUrl?: string
  client?: string
  industry?: string
  duration?: string
  /** Case-study video below the intro description. `null` hides the block. */
  storyVideo?: MediaAsset | null
  /** Title below the story video — separate from the page H1 and intro description. */
  storyVideoTitle?: string
  /** Body copy below the story video title. */
  storyVideoDescription?: string
  /** Photos below the below-video copy (two on top, one full width below). */
  storyGalleryImages?: ReadonlyArray<{ src: string; alt: string }>
  /** Title below the gallery — separate from the below-video title. */
  storyGalleryTitle?: string
  /** Description below the gallery title. */
  storyGalleryDescription?: string
}
