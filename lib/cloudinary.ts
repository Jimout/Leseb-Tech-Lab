import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'node:stream'

import type { MediaAsset } from '@/lib/media-assets'

type CloudinaryEnvKey =
  | 'CLOUDINARY_CLOUD_NAME'
  | 'CLOUDINARY_API_KEY'
  | 'CLOUDINARY_API_SECRET'

function requireEnv(key: CloudinaryEnvKey): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

let configured = false

function ensureCloudinaryConfigured() {
  if (configured) return
  cloudinary.config({
    cloud_name: requireEnv('CLOUDINARY_CLOUD_NAME'),
    api_key: requireEnv('CLOUDINARY_API_KEY'),
    api_secret: requireEnv('CLOUDINARY_API_SECRET'),
    secure: true,
  })
  configured = true
}

const SIGNED_DOWNLOAD_TTL_SECONDS = 60

export type UploadPrivateRawInput = {
  buffer: Buffer
  filename: string
  folder?: string
}

export type UploadPrivateRawResult = {
  publicId: string
}

type UploadStreamResult = {
  public_id: string
}

type UploadMediaInput = {
  buffer: Buffer
  filename: string
  folder?: string
  kind?: 'image' | 'video' | 'gif'
}

type UploadMediaResult = MediaAsset

export async function uploadMediaAsset(input: UploadMediaInput): Promise<UploadMediaResult> {
  ensureCloudinaryConfigured()
  const { buffer, filename, folder, kind } = input
  const format = filename.split('.').pop()?.toLowerCase()
  const resourceType = kind === 'video' ? 'video' : 'image'

  const uploaded = await new Promise<{
    public_id: string
    secure_url: string
    width?: number
    height?: number
    duration?: number
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
        public_id: filename.replace(/\.[^.]+$/, ''),
        overwrite: false,
        use_filename: true,
        unique_filename: true,
        invalidate: false,
        format,
      },
      (error, result) => {
        if (error) return reject(error)
        if (!result?.public_id || !result.secure_url) {
          return reject(new Error('Cloudinary upload returned incomplete payload'))
        }
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          duration: result.duration,
        })
      },
    )
    Readable.from(buffer).pipe(stream)
  })

  const type: MediaAsset['type'] =
    kind === 'video' ? 'video' : kind === 'gif' || format === 'gif' ? 'gif' : 'image'

  return {
    type,
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    width: uploaded.width,
    height: uploaded.height,
    duration: uploaded.duration,
    thumbnailUrl:
      type === 'video' ? cloudinary.url(uploaded.public_id, { resource_type: 'video', format: 'jpg' }) : undefined,
  }
}

export async function destroyMediaAsset(publicId: string, resourceType: 'image' | 'video' = 'image') {
  ensureCloudinaryConfigured()
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true })
}

/**
 * Upload a private downloadable file to Cloudinary.
 * - resource_type: raw
 * - type: private
 * Returns only the public_id for secure server-side retrieval.
 */
export async function uploadPrivateRawFile(
  input: UploadPrivateRawInput,
): Promise<UploadPrivateRawResult> {
  ensureCloudinaryConfigured()
  const { buffer, filename, folder } = input

  const result = await new Promise<UploadStreamResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        type: 'private',
        folder,
        public_id: filename,
        overwrite: false,
        invalidate: false,
      },
      (error, uploadResult) => {
        if (error) return reject(error)
        if (!uploadResult?.public_id) {
          return reject(new Error('Cloudinary upload returned no public_id'))
        }
        resolve({ public_id: uploadResult.public_id })
      },
    )

    Readable.from(buffer).pipe(stream)
  })

  return { publicId: result.public_id }
}

/**
 * Generate a short-lived signed URL for private file download.
 * URL is valid for 60 seconds.
 */
export function generateSignedPrivateDownloadUrl(publicId: string): string {
  ensureCloudinaryConfigured()
  const expiresAt = Math.floor(Date.now() / 1000) + SIGNED_DOWNLOAD_TTL_SECONDS

  return cloudinary.utils.private_download_url(publicId, undefined, {
    resource_type: 'raw',
    type: 'private',
    expires_at: expiresAt,
  })
}

/**
 * Example usage (backend only):
 *
 * // 1) Upload a file buffer as private raw
 * const uploaded = await uploadPrivateRawFile({
 *   buffer: Buffer.from(await file.arrayBuffer()),
 *   filename: file.name,
 *   folder: 'downloads',
 * })
 * // uploaded.publicId -> persist this in DB
 *
 * // 2) Generate a signed download link (60s TTL)
 * const signedUrl = generateSignedPrivateDownloadUrl(uploaded.publicId)
 * // Return redirect/response from a server route; do not expose direct public URLs.
 */

