import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { MediaAsset } from '@/lib/media-assets'

export const LOCAL_DEV_PUBLIC_ID_PREFIX = 'local-dev'

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads', 'dev')

function sanitizeSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9_-]+/g, '').slice(0, 80)
}

function extensionFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : 'bin'
}

export async function uploadLocalDevMedia(input: {
  buffer: Buffer
  filename: string
  folder?: string
  kind?: 'image' | 'video' | 'gif'
}): Promise<MediaAsset> {
  const folder = sanitizeSegment((input.folder || 'portfolio-media').replace(/\//g, '-')) || 'portfolio-media'
  const ext = extensionFromFilename(input.filename)
  const id = crypto.randomUUID()
  const relativePath = path.posix.join(folder, `${id}.${ext}`)
  const absolutePath = path.join(UPLOAD_ROOT, ...relativePath.split('/'))

  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, input.buffer)

  const format = ext
  const type: MediaAsset['type'] =
    input.kind === 'video' ? 'video' : input.kind === 'gif' || format === 'gif' ? 'gif' : 'image'

  const urlPath = `/uploads/dev/${relativePath.replace(/\\/g, '/')}`
  return {
    type,
    url: urlPath,
    publicId: `${LOCAL_DEV_PUBLIC_ID_PREFIX}/${relativePath.replace(/\\/g, '/')}`,
  }
}

export async function destroyLocalDevMedia(publicId: string): Promise<void> {
  const prefix = `${LOCAL_DEV_PUBLIC_ID_PREFIX}/`
  if (!publicId.startsWith(prefix)) {
    throw new Error('Not a local dev media asset.')
  }
  const relativePath = publicId.slice(prefix.length)
  if (!relativePath || relativePath.includes('..')) {
    throw new Error('Invalid local dev media id.')
  }
  const absolutePath = path.join(UPLOAD_ROOT, ...relativePath.split('/'))
  const resolved = path.resolve(absolutePath)
  if (!resolved.startsWith(path.resolve(UPLOAD_ROOT))) {
    throw new Error('Invalid local dev media path.')
  }
  await unlink(resolved).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error
  })
}
