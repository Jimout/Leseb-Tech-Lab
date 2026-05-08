export type MediaAssetType = 'image' | 'video' | 'gif' | 'embed360'

export type MediaAsset = {
  type: MediaAssetType
  url: string
  publicId?: string
  thumbnailUrl?: string
  alt?: string
  width?: number
  height?: number
  duration?: number
  embedUrl?: string
}

const ALLOWED_EMBED_HOSTS = new Set([
  'matterport.com',
  'my.matterport.com',
  'kuula.co',
  'www.kuula.co',
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'player.vimeo.com',
  'vimeo.com',
])

export function sanitizeEmbed360Url(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return null
    const host = url.hostname.toLowerCase()
    const allowed = [...ALLOWED_EMBED_HOSTS].some((h) => host === h || host.endsWith(`.${h}`))
    if (!allowed) return null
    return url.toString()
  } catch {
    return null
  }
}

export function imageAltFromFileName(name: string, fallback = 'Media file') {
  const base = name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  return base || fallback
}

export function cloudinaryPublicIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('res.cloudinary.com')) return null
    const marker = '/upload/'
    const idx = parsed.pathname.indexOf(marker)
    if (idx === -1) return null
    let trailing = parsed.pathname.slice(idx + marker.length)
    trailing = trailing.replace(/^v\d+\//, '')
    trailing = trailing.replace(/\.[a-zA-Z0-9]+$/, '')
    return trailing || null
  } catch {
    return null
  }
}
