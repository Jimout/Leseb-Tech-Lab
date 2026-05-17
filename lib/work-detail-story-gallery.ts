import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import type { ShowcaseWork } from '@/lib/works-showcase-data'

export type WorkDetailStoryGalleryImage = {
  src: string
  alt: string
}

/** Two images on top, one full-width image below. */
export const STORY_GALLERY_IMAGE_COUNT = 3

export function storyGalleryCellLayoutClass(index: number): string {
  if (index === 2) return 'md:col-span-2'
  return ''
}

const SHOWCASE_STORY_GALLERY: Partial<Record<string, WorkDetailStoryGalleryImage[]>> = {
  'selam-os': [
    {
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      alt: 'Team reviewing conversational UI flows on a large display',
    },
    {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
      alt: 'Workshop with sticky notes mapping dialogue paths',
    },
    {
      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80',
      alt: 'Sprint review with prototype on screen',
    },
  ],
  mesob: [
    {
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      alt: 'Community members gathered around a shared table',
    },
    {
      src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=900&q=80',
      alt: 'Facilitator leading a neighborhood planning session',
    },
    {
      src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80',
      alt: 'Team debrief after a field visit',
    },
  ],
  atlas: [
    {
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Workspace with knowledge base on screen',
    },
    {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      alt: 'Search and retrieval metrics dashboard',
    },
    {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
      alt: 'Team aligning on shared context before release',
    },
  ],
}

function takeStoryGalleryImages(images: WorkDetailStoryGalleryImage[]): WorkDetailStoryGalleryImage[] {
  return images.filter((img) => img.src?.trim()).slice(0, STORY_GALLERY_IMAGE_COUNT)
}

export function defaultStoryGalleryForWork(work: ShowcaseWork): WorkDetailStoryGalleryImage[] {
  const seed = SHOWCASE_STORY_GALLERY[work.slug] ?? SHOWCASE_STORY_GALLERY[work.id]
  if (seed?.length) return takeStoryGalleryImages(seed)
  if (!work.heroMedia?.url) return []
  return takeStoryGalleryImages([
    { src: work.heroMedia.url, alt: work.heroMedia.alt || work.title },
    {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
      alt: `${work.title} process documentation`,
    },
    {
      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80',
      alt: `${work.title} team collaboration`,
    },
  ])
}

export function resolveWorkDetailStoryGallery(
  detail: ResolvedWorkDetail,
): WorkDetailStoryGalleryImage[] {
  const custom = detail.storyGalleryImages?.filter((img) => img.src?.trim()) ?? []
  if (custom.length > 0) return takeStoryGalleryImages(custom)
  return defaultStoryGalleryForWork(detail.work)
}
