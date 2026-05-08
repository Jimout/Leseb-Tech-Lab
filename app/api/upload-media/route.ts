import { NextRequest, NextResponse } from 'next/server'

import { requireAdminAccess } from '@/lib/admin-api-auth'
import { destroyMediaAsset, uploadMediaAsset } from '@/lib/cloudinary'

export const runtime = 'nodejs'

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

function sanitizeFolder(folder: string | null): string {
  const raw = (folder || 'portfolio-media').trim()
  return raw.replace(/[^a-zA-Z0-9/_-]+/g, '').replace(/\/+/g, '/')
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = sanitizeFolder(String(formData.get('folder') || 'portfolio-media'))
    const kindRaw = String(formData.get('kind') || '').toLowerCase()
    const kind = kindRaw === 'video' || kindRaw === 'gif' || kindRaw === 'image' ? kindRaw : undefined

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file field.' }, { status: 400 })
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file cannot be uploaded.' }, { status: 400 })
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File too large (max 50 MB).' }, { status: 413 })
    }
    const isVideo = file.type.startsWith('video/')
    if (isVideo && !ALLOWED_VIDEO_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Unsupported video MIME type: ${file.type}` }, { status: 415 })
    }
    if (!isVideo && !ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Unsupported image MIME type: ${file.type}` }, { status: 415 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await uploadMediaAsset({
      buffer,
      filename: file.name,
      folder,
      kind,
    })
    return NextResponse.json({ asset }, { status: 201 })
  } catch (error) {
    console.error('POST /api/upload-media failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to upload media.'
    const safeMessage =
      process.env.NODE_ENV === 'development' ? message : 'Failed to upload media.'
    return NextResponse.json({ error: safeMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = requireAdminAccess(request)
  if (authError) return authError

  try {
    const body = (await request.json()) as { publicId?: string; resourceType?: 'image' | 'video' }
    const publicId = String(body.publicId || '').trim()
    const resourceType = body.resourceType === 'video' ? 'video' : 'image'
    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required.' }, { status: 400 })
    }
    await destroyMediaAsset(publicId, resourceType)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/upload-media failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete media.'
    const safeMessage =
      process.env.NODE_ENV === 'development' ? message : 'Failed to delete media.'
    return NextResponse.json({ error: safeMessage }, { status: 500 })
  }
}
