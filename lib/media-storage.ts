import { destroyMediaAsset, isCloudinaryConfigured, uploadMediaAsset } from '@/lib/cloudinary'
import {
  destroyLocalDevMedia,
  LOCAL_DEV_PUBLIC_ID_PREFIX,
  uploadLocalDevMedia,
} from '@/lib/local-dev-media'
import type { MediaAsset } from '@/lib/media-assets'

type UploadInput = {
  buffer: Buffer
  filename: string
  folder?: string
  kind?: 'image' | 'video' | 'gif'
}

export async function uploadStoredMedia(input: UploadInput): Promise<MediaAsset> {
  if (isCloudinaryConfigured()) {
    return uploadMediaAsset(input)
  }
  if (process.env.NODE_ENV === 'development') {
    return uploadLocalDevMedia(input)
  }
  throw new Error(
    'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file (see .env.example). Get credentials at https://console.cloudinary.com/settings/api-keys',
  )
}

export async function destroyStoredMedia(publicId: string, resourceType: 'image' | 'video' = 'image') {
  if (publicId.startsWith(`${LOCAL_DEV_PUBLIC_ID_PREFIX}/`)) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Local dev media can only be deleted in development.')
    }
    await destroyLocalDevMedia(publicId)
    return
  }
  await destroyMediaAsset(publicId, resourceType)
}
