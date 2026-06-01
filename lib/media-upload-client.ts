'use client'

import type { MediaAsset } from '@/lib/media-assets'
import { assertAllowedUploadMime, prepareFileForUpload } from '@/lib/media-file-type'
import { isAdminLoggedIn } from '@/lib/frontend-auth'

type UploadMediaClientInput = {
  file: File
  folder?: string
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

function detectKindFromMime(mime: string): 'image' | 'gif' | 'video' {
  if (mime === 'image/gif') return 'gif'
  if (mime.startsWith('video/')) return 'video'
  return 'image'
}

function readFileAsDataUrl(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return
      onProgress(Math.round((event.loaded / event.total) * 100))
    }
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsDataURL(file)
  })
}

export async function uploadMediaClient(input: UploadMediaClientInput): Promise<MediaAsset> {
  const { file, onProgress, signal } = input

  if (!isAdminLoggedIn()) {
    throw new Error('Sign in again to upload images.')
  }

  const prepared = prepareFileForUpload(file)
  const mime = prepared.type
  assertAllowedUploadMime(mime)

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File too large (max 10 MB in frontend-only mode).')
  }

  if (signal?.aborted) {
    throw new Error('Upload cancelled.')
  }

  const url = await readFileAsDataUrl(prepared, onProgress)
  const kind = detectKindFromMime(mime)

  return {
    type: kind === 'video' ? 'video' : 'image',
    url,
    alt: file.name.replace(/\.[^.]+$/, ''),
  }
}

export async function deleteMediaByPublicId(_publicId: string): Promise<void> {
  // Frontend-only mode stores media inline; nothing to delete remotely.
}
