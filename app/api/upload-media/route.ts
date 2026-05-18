import { NextRequest, NextResponse } from 'next/server'

import { requireAdminAccess } from '@/lib/admin-api-auth'
import { destroyStoredMedia, uploadStoredMedia } from '@/lib/media-storage'
import { assertAllowedUploadMime, resolveUploadMimeType } from '@/lib/media-file-type'

export const runtime = 'nodejs'

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024

function sanitizeFolder(folder: string | null): string {
  const raw = (folder || 'portfolio-media').trim()
  return raw.replace(/[^a-zA-Z0-9/_-]+/g, '').replace(/\/+/g, '/')
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = sanitizeFolder(String(formData.get('folder') || 'portfolio-media'))
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file field.' }, { status: 400 })
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file cannot be uploaded.' }, { status: 400 })
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File too large (max 50 MB).' }, { status: 413 })
    }
    const mimeType = resolveUploadMimeType(file)
    if (!mimeType) {
      return NextResponse.json(
        { error: 'Could not detect file type. Use PNG, JPEG, WebP, GIF, or AVIF.' },
        { status: 415 },
      )
    }
    try {
      assertAllowedUploadMime(mimeType)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unsupported file type.'
      return NextResponse.json({ error: message }, { status: 415 })
    }
    const isVideo = mimeType.startsWith('video/')
    const kindRaw = String(formData.get('kind') || '').toLowerCase()
    const kindFromForm =
      kindRaw === 'video' || kindRaw === 'gif' || kindRaw === 'image' ? kindRaw : undefined
    const kind = kindFromForm ?? (isVideo ? 'video' : mimeType === 'image/gif' ? 'gif' : 'image')

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await uploadStoredMedia({
      buffer,
      filename: file.name,
      folder,
      kind,
    })
    return NextResponse.json({ asset }, { status: 201 })
  } catch (error) {
    console.error('POST /api/upload-media failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to upload media.'
    const isCloudinaryConfig = message.includes('Cloudinary is not configured')
    const safeMessage = isCloudinaryConfig
      ? message
      : process.env.NODE_ENV === 'development'
        ? message
        : 'Failed to upload media.'
    return NextResponse.json({ error: safeMessage }, { status: isCloudinaryConfig ? 503 : 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAccess(request)
  if (authError) return authError

  try {
    const body = (await request.json()) as { publicId?: string; resourceType?: 'image' | 'video' }
    const publicId = String(body.publicId || '').trim()
    const resourceType = body.resourceType === 'video' ? 'video' : 'image'
    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required.' }, { status: 400 })
    }
    await destroyStoredMedia(publicId, resourceType)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/upload-media failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete media.'
    const isCloudinaryConfig = message.includes('Cloudinary is not configured')
    const safeMessage = isCloudinaryConfig
      ? message
      : process.env.NODE_ENV === 'development'
        ? message
        : 'Failed to delete media.'
    return NextResponse.json({ error: safeMessage }, { status: isCloudinaryConfig ? 503 : 500 })
  }
}
