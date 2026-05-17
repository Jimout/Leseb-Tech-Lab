import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'
import { sanitizeEmbed360Url } from '@/lib/media-assets'

export type WorkDetailContentBlock =
  | { id: string; type: 'rich'; html: string }
  | {
      id: string
      type: 'image'
      src: string
      alt: string
      /** Tall full-width hero proportion vs aspect-video gallery */
      variant: 'hero' | 'wide'
      publicId?: string
    }
  | {
      id: string
      type: 'gif'
      src: string
      alt: string
      variant: 'hero' | 'wide'
      publicId?: string
    }
  | {
      id: string
      type: 'video'
      src: string
      /** Optional poster image URL */
      poster?: string
      /** Optional text alternative shown if video fails */
      alt?: string
      variant: 'hero' | 'wide'
      /** Whether controls should be visible on frontend */
      controls?: boolean
      /** Autoplay muted loop inline when true */
      autoplay?: boolean
      publicId?: string
      posterPublicId?: string
    }
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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function wrapPlainTextAsHtml(s: string): string {
  const t = s.trim()
  if (!t) return ''
  if (/[<>]/.test(t)) return t
  return `<p>${escapeHtml(t)}</p>`
}

export function normalizeWorkDetailContentBlocks(
  blocks: WorkDetailContentBlock[] | undefined,
): WorkDetailContentBlock[] {
  if (!blocks?.length) return []
  const mapped: WorkDetailContentBlock[] = blocks.map((b) => {
    if (b.type === 'rich') {
      return { type: 'rich', id: b.id || newContentBlockId(), html: b.html }
    }
    if (b.type === 'video') {
      const variant: 'hero' | 'wide' = b.variant === 'wide' ? 'wide' : 'hero'
      return {
        type: 'video',
        id: b.id || newContentBlockId(),
        src: b.src.trim(),
        poster: b.poster?.trim() || undefined,
        alt: b.alt?.trim() || undefined,
        variant,
        controls: b.controls !== false,
        autoplay: Boolean(b.autoplay),
        publicId: b.publicId?.trim() || undefined,
        posterPublicId: b.posterPublicId?.trim() || undefined,
      }
    }
    if (b.type === 'embed360') {
      const embedUrl = sanitizeEmbed360Url(b.embedUrl) || ''
      const variant: 'hero' | 'wide' = b.variant === 'wide' ? 'wide' : 'hero'
      return {
        type: 'embed360',
        id: b.id || newContentBlockId(),
        embedUrl,
        title: b.title?.trim() || undefined,
        variant,
      }
    }
    const variant: 'hero' | 'wide' = b.variant === 'wide' ? 'wide' : 'hero'
    const type: 'image' | 'gif' = b.type === 'gif' ? 'gif' : 'image'
    return {
      type,
      id: b.id || newContentBlockId(),
      src: b.src.trim(),
      alt: b.alt.trim(),
      variant,
      publicId: b.publicId?.trim() || undefined,
    }
  })
  return mapped.filter((b) => {
    if (b.type === 'rich') return !isInsightHtmlEmpty(b.html)
    if (b.type === 'embed360') return Boolean(b.embedUrl)
    if (b.type === 'video') return Boolean(b.src)
    return Boolean(b.src)
  })
}

type LegacyDetailLike = {
  descriptionBelowImages?: Array<{ src: string; alt: string }>
  secondaryHeroImage?: { src: string; alt: string } | null
  additionalImages?: Array<{ src: string; alt: string }>
  secondaryImageDescriptionColumns?: string[]
}

/** When no `contentBlocks` are stored yet, build blocks from legacy detail fields. */
export function deriveBlocksFromLegacy(d: LegacyDetailLike): WorkDetailContentBlock[] {
  const out: WorkDetailContentBlock[] = []
  for (const img of d.descriptionBelowImages ?? []) {
    if (img.src.trim()) {
      out.push({
        id: newContentBlockId(),
        type: 'image',
        src: img.src.trim(),
        alt: img.alt.trim(),
        variant: 'hero',
      })
    }
  }
  const sh = d.secondaryHeroImage
  if (sh && sh !== null && sh.src.trim()) {
    out.push({
      id: newContentBlockId(),
      type: 'image',
      src: sh.src.trim(),
      alt: sh.alt.trim(),
      variant: 'hero',
    })
  }
  for (const para of d.secondaryImageDescriptionColumns ?? []) {
    const html = wrapPlainTextAsHtml(para)
    if (html && !isInsightHtmlEmpty(html)) {
      out.push({ id: newContentBlockId(), type: 'rich', html })
    }
  }
  for (const img of d.additionalImages ?? []) {
    if (img.src.trim()) {
      out.push({
        id: newContentBlockId(),
        type: 'image',
        src: img.src.trim(),
        alt: img.alt.trim(),
        variant: 'wide',
      })
    }
  }
  return out
}
