const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
}

export const ALLOWED_IMAGE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
])

export const ALLOWED_VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

/** Resolve MIME when the browser omits `file.type` (common on Windows). */
export function resolveUploadMimeType(file: File): string {
  const fromBrowser = file.type?.trim().toLowerCase()
  if (fromBrowser && fromBrowser !== 'application/octet-stream') return fromBrowser

  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext]

  return ''
}

/** File suitable for upload validation and FormData (fills in missing type). */
export function prepareFileForUpload(file: File): File {
  const mime = resolveUploadMimeType(file)
  if (!mime) {
    throw new Error('Unsupported file type. Use PNG, JPEG, WebP, GIF, or AVIF.')
  }
  if (file.type === mime) return file
  return new File([file], file.name, { type: mime, lastModified: file.lastModified })
}

export function assertAllowedUploadMime(mime: string): void {
  const normalized = mime.toLowerCase()
  const isVideo = normalized.startsWith('video/')
  if (isVideo) {
    if (!ALLOWED_VIDEO_MIMES.has(normalized)) {
      throw new Error(`Unsupported video type: ${mime}`)
    }
    return
  }
  if (!ALLOWED_IMAGE_MIMES.has(normalized)) {
    throw new Error(`Unsupported image type: ${mime || 'unknown'}`)
  }
}
