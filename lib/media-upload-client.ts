'use client'

import type { MediaAsset } from '@/lib/media-assets'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'

type UploadMediaClientInput = {
  file: File
  folder?: string
  onProgress?: (percent: number) => void
  signal?: AbortSignal
  timeoutMs?: number
  retries?: number
  onRetry?: (attempt: number, error: Error) => void
}

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

function detectKindFromFile(file: File): 'image' | 'gif' | 'video' {
  if (file.type === 'image/gif') return 'gif'
  if (file.type.startsWith('video/')) return 'video'
  return 'image'
}

export async function uploadMediaClient(input: UploadMediaClientInput): Promise<MediaAsset> {
  const { file, folder, onProgress, signal, timeoutMs = 90_000, retries = 1, onRetry } = input
  if (!file.type) throw new Error('File has no MIME type.')
  const isVideo = file.type.startsWith('video/')
  if (isVideo && !ALLOWED_VIDEO_TYPES.has(file.type)) {
    throw new Error(`Unsupported video type: ${file.type}`)
  }
  if (!isVideo && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(`Unsupported image type: ${file.type}`)
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File too large (max 50 MB).')
  }

  const form = new FormData()
  form.append('file', file)
  if (folder) form.append('folder', folder)
  form.append('kind', detectKindFromFile(file))

  const runOnce = async () =>
    await new Promise<MediaAsset>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload-media')
      const sessionHeader = getSessionHeaderFromStorage()
      if (sessionHeader) xhr.setRequestHeader('x-session', sessionHeader)

      const timeoutId = window.setTimeout(() => {
        xhr.abort()
        reject(new Error('Upload timed out. Please retry.'))
      }, timeoutMs)

      const onAbort = () => {
        window.clearTimeout(timeoutId)
        xhr.abort()
        reject(new Error('Upload cancelled.'))
      }
      signal?.addEventListener('abort', onAbort, { once: true })

      xhr.upload.onprogress = (event) => {
        if (!onProgress || !event.lengthComputable) return
        onProgress(Math.round((event.loaded / event.total) * 100))
      }

      xhr.onerror = () => {
        window.clearTimeout(timeoutId)
        reject(new Error('Network error while uploading media.'))
      }
      xhr.onload = () => {
        window.clearTimeout(timeoutId)
        if (xhr.status < 200 || xhr.status >= 300) {
          let message = 'Failed to upload media.'
          try {
            const parsed = JSON.parse(xhr.responseText) as { error?: string }
            if (parsed.error) message = parsed.error
          } catch {}
          reject(new Error(message))
          return
        }
        try {
          const parsed = JSON.parse(xhr.responseText) as { asset?: MediaAsset }
          if (!parsed.asset?.url) {
            reject(new Error('Upload succeeded but media payload is invalid.'))
            return
          }
          resolve(parsed.asset)
        } catch {
          reject(new Error('Upload response was not valid JSON.'))
        }
      }
      xhr.send(form)
    })

  let attempt = 0
  for (;;) {
    try {
      return await runOnce()
    } catch (error) {
      attempt += 1
      const err = error instanceof Error ? error : new Error(String(error))
      if (attempt > retries) throw err
      onRetry?.(attempt, err)
    }
  }
}

export async function deleteMediaByPublicId(publicId: string): Promise<void> {
  const sessionHeader = getSessionHeaderFromStorage()
  const response = await fetch('/api/upload-media', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionHeader ? { 'x-session': sessionHeader } : {}),
    },
    body: JSON.stringify({ publicId }),
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error || 'Failed to delete media from Cloudinary.')
  }
}
