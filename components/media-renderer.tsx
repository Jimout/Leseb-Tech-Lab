'use client'

import Image from 'next/image'
import * as React from 'react'

import type { MediaAsset } from '@/lib/media-assets'
import { cloudinaryOptimizedImageUrl, cloudinaryVideoPosterUrl } from '@/lib/cloudinary-media'
import { sanitizeEmbed360Url } from '@/lib/media-assets'

export function MediaRenderer({
  media,
  className,
  sizes,
  controls = true,
  autoplay = false,
  variant = 'default',
  showSkeleton = false,
  uploadProgress,
}: {
  media: MediaAsset
  className?: string
  sizes?: string
  controls?: boolean
  autoplay?: boolean
  variant?: 'default' | 'admin-preview' | 'thumbnail'
  showSkeleton?: boolean
  uploadProgress?: number
}) {
  const [imageFailed, setImageFailed] = React.useState(false)
  const [videoFailed, setVideoFailed] = React.useState(false)
  const baseClass =
    variant === 'admin-preview'
      ? `rounded-md border border-white/10 bg-black/30 ${className ?? ''}`
      : className

  if (!media?.type || !media?.url) {
    return (
      <div className={baseClass} role="img" aria-label="Media unavailable">
        <span className="sr-only">Media unavailable</span>
      </div>
    )
  }

  if (showSkeleton && !imageFailed && !videoFailed) {
    // Skeleton sits under the media node where parent uses relative positioning.
  }

  if (media.type === 'video') {
    const poster = media.thumbnailUrl || cloudinaryVideoPosterUrl(media.url)
    if (videoFailed) {
      return (
        <div className={baseClass} role="img" aria-label={media.alt || 'Video unavailable'}>
          <span className="sr-only">{media.alt || 'Video unavailable'}</span>
        </div>
      )
    }
    return (
      <video
        src={media.url}
        poster={poster}
        className={baseClass}
        controls={controls}
        autoPlay={autoplay}
        muted={autoplay}
        loop={autoplay}
        playsInline
        preload={autoplay ? 'auto' : 'metadata'}
        onError={() => setVideoFailed(true)}
      />
    )
  }

  if (media.type === 'embed360') {
    const safeUrl = sanitizeEmbed360Url(media.embedUrl || media.url)
    if (!safeUrl) {
      return (
        <div className={baseClass} role="img" aria-label="360 media unavailable">
          <span className="sr-only">360 media unavailable</span>
        </div>
      )
    }
    return (
      <iframe
        src={safeUrl}
        title={media.alt || '360 embed'}
        className={baseClass}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
        allowFullScreen
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    )
  }

  const optimizedSrc = cloudinaryOptimizedImageUrl(media.url)
  if (imageFailed) {
    return (
      <div className={baseClass} role="img" aria-label={media.alt || 'Image unavailable'}>
        <span className="sr-only">{media.alt || 'Image unavailable'}</span>
      </div>
    )
  }
  return (
    <>
      {showSkeleton ? <div className={`${baseClass} animate-pulse`} aria-hidden /> : null}
      <Image
        src={optimizedSrc}
        alt={media.alt || ''}
        fill
        className={baseClass}
        sizes={sizes}
        loading="lazy"
        unoptimized={media.url.includes('res.cloudinary.com') ? false : undefined}
        onError={() => setImageFailed(true)}
      />
      {typeof uploadProgress === 'number' && uploadProgress >= 0 && uploadProgress < 100 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden>
          <div className="h-full bg-white/70 transition-[width]" style={{ width: `${uploadProgress}%` }} />
        </div>
      ) : null}
    </>
  )
}
