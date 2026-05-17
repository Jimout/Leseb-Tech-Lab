import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'

export type GalleryColumnCount = 1 | 2 | 3 | 4

export type WorkDetailGalleryImage = {
  src: string
  alt: string
  publicId?: string
}

/** Flexible sections below the case-study video on project pages. */
export type WorkDetailContentBlock =
  | { id: string; type: 'text'; title?: string; description: string }
  | {
      id: string
      type: 'gallery'
      title?: string
      description?: string
      columns: GalleryColumnCount
      images: WorkDetailGalleryImage[]
    }
  | { id: string; type: 'button'; label: string; url: string }
  /** @deprecated Migrated to `text` on read. */
  | { id: string; type: 'rich'; html: string }
  /** @deprecated Migrated to `gallery` on read. */
  | {
      id: string
      type: 'image'
      src: string
      alt: string
      variant: 'hero' | 'wide'
      publicId?: string
    }
  /** @deprecated Migrated to `gallery` on read. */
  | {
      id: string
      type: 'gif'
      src: string
      alt: string
      variant: 'hero' | 'wide'
      publicId?: string
    }
  /** @deprecated Dropped on read. */
  | {
      id: string
      type: 'video'
      src: string
      poster?: string
      alt?: string
      variant: 'hero' | 'wide'
      controls?: boolean
      autoplay?: boolean
      publicId?: string
      posterPublicId?: string
    }
  /** @deprecated Dropped on read. */
  | {
      id: string
      type: 'embed360'
      embedUrl: string
      title?: string
      variant: 'hero' | 'wide'
    }

export function newContentBlockId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function galleryGridClass(columns: GalleryColumnCount): string {
  switch (columns) {
    case 1:
      return 'grid grid-cols-1 gap-4 sm:gap-5'
    case 2:
      return 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5'
    case 3:
      return 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3'
    case 4:
      return 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'
    default:
      return 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5'
  }
}

function stripHtmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function normalizeColumns(value: unknown): GalleryColumnCount {
  const n = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (n === 1 || n === 2 || n === 3 || n === 4) return n
  return 2
}

function migrateLegacyBlock(block: WorkDetailContentBlock): WorkDetailContentBlock | null {
  if (block.type === 'text') {
    const description = block.description?.trim() ?? ''
    if (!description) return null
    return {
      id: block.id || newContentBlockId(),
      type: 'text',
      title: block.title?.trim() || undefined,
      description,
    }
  }

  if (block.type === 'gallery') {
    const images = (block.images ?? []).filter((img) => img.src?.trim())
    if (!images.length && !block.title?.trim() && !block.description?.trim()) return null
    return {
      id: block.id || newContentBlockId(),
      type: 'gallery',
      title: block.title?.trim() || undefined,
      description: block.description?.trim() || undefined,
      columns: normalizeColumns(block.columns),
      images: images.map((img) => ({
        src: img.src.trim(),
        alt: img.alt?.trim() ?? '',
        publicId: img.publicId?.trim() || undefined,
      })),
    }
  }

  if (block.type === 'button') {
    const url = block.url?.trim() ?? ''
    if (!url) return null
    return {
      id: block.id || newContentBlockId(),
      type: 'button',
      label: block.label?.trim() || 'Visit website',
      url,
    }
  }

  if (block.type === 'rich') {
    const description = stripHtmlToPlainText(block.html)
    if (!description) return null
    return { id: block.id || newContentBlockId(), type: 'text', description }
  }

  if (block.type === 'image' || block.type === 'gif') {
    if (!block.src?.trim()) return null
    return {
      id: block.id || newContentBlockId(),
      type: 'gallery',
      columns: block.variant === 'wide' ? 2 : 1,
      images: [{ src: block.src.trim(), alt: block.alt?.trim() ?? '', publicId: block.publicId }],
    }
  }

  return null
}

export function normalizeWorkDetailContentBlocks(
  blocks: WorkDetailContentBlock[] | undefined,
): WorkDetailContentBlock[] {
  if (!blocks?.length) return []
  const out: WorkDetailContentBlock[] = []
  for (const block of blocks) {
    const migrated = migrateLegacyBlock(block)
    if (migrated) out.push(migrated)
  }
  return out
}

type LegacyDetailLike = {
  descriptionBelowImages?: Array<{ src: string; alt: string }>
  secondaryHeroImage?: { src: string; alt: string } | null
  additionalImages?: Array<{ src: string; alt: string }>
  secondaryImageDescriptionColumns?: string[]
  storyVideoTitle?: string
  storyVideoDescription?: string
  storyGalleryImages?: WorkDetailGalleryImage[]
  storyGalleryTitle?: string
  storyGalleryDescription?: string
}

/** When no `contentBlocks` are stored yet, build sections from legacy detail fields. */
export function deriveBlocksFromLegacy(d: LegacyDetailLike): WorkDetailContentBlock[] {
  const out: WorkDetailContentBlock[] = []

  const belowVideoTitle = d.storyVideoTitle?.trim()
  const belowVideoDescription = d.storyVideoDescription?.trim()
  if (belowVideoTitle || belowVideoDescription) {
    out.push({
      id: newContentBlockId(),
      type: 'text',
      title: belowVideoTitle,
      description: belowVideoDescription ?? '',
    })
  }

  const galleryImages = (d.storyGalleryImages ?? []).filter((img) => img.src?.trim())
  const galleryTitle = d.storyGalleryTitle?.trim()
  const galleryDescription = d.storyGalleryDescription?.trim()
  if (galleryImages.length || galleryTitle || galleryDescription) {
    out.push({
      id: newContentBlockId(),
      type: 'gallery',
      title: galleryTitle,
      description: galleryDescription,
      columns: 2,
      images: galleryImages.map((img) => ({
        src: img.src.trim(),
        alt: img.alt?.trim() ?? '',
        publicId: img.publicId,
      })),
    })
  }

  for (const img of d.descriptionBelowImages ?? []) {
    if (img.src.trim()) {
      out.push({
        id: newContentBlockId(),
        type: 'gallery',
        columns: 1,
        images: [{ src: img.src.trim(), alt: img.alt.trim() }],
      })
    }
  }

  const sh = d.secondaryHeroImage
  if (sh && sh !== null && sh.src.trim()) {
    out.push({
      id: newContentBlockId(),
      type: 'gallery',
      columns: 1,
      images: [{ src: sh.src.trim(), alt: sh.alt.trim() }],
    })
  }

  for (const para of d.secondaryImageDescriptionColumns ?? []) {
    const description = para.trim()
    if (description) {
      out.push({ id: newContentBlockId(), type: 'text', description })
    }
  }

  for (const img of d.additionalImages ?? []) {
    if (img.src.trim()) {
      out.push({
        id: newContentBlockId(),
        type: 'gallery',
        columns: 2,
        images: [{ src: img.src.trim(), alt: img.alt.trim() }],
      })
    }
  }

  return out
}

export function isLegacyRichBlock(
  block: WorkDetailContentBlock,
): block is Extract<WorkDetailContentBlock, { type: 'rich' }> {
  return block.type === 'rich' && !isInsightHtmlEmpty(block.html)
}
