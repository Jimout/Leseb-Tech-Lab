'use client'

import * as React from 'react'

import { MediaRenderer } from '@/components/media-renderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { imageAltFromFileName } from '@/lib/media-assets'
import { deleteMediaByPublicId, uploadMediaClient } from '@/lib/media-upload-client'
import { cn } from '@/lib/utils'

type MediaBlock = Exclude<WorkDetailContentBlock, { type: 'rich' | 'embed360' }>

export function AdminWorkContentBlockImageFields({
  block,
  onPatch,
}: {
  block: MediaBlock
  onPatch: (b: WorkDetailContentBlock) => void
}) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const posterRef = React.useRef<HTMLInputElement>(null)
  const isVideo = block.type === 'video'
  const fileLabel = isVideo ? 'Media file' : block.type === 'gif' ? 'GIF file' : 'Image file'
  const fileAccept = isVideo ? 'video/*' : block.type === 'gif' ? 'image/gif' : 'image/*'

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const asset = await uploadMediaClient({
        file,
        folder: block.type === 'video' ? 'work/blocks/video' : block.type === 'gif' ? 'work/blocks/gif' : 'work/blocks/image',
      })
      if (block.publicId) {
        void deleteMediaByPublicId(block.publicId).catch(() => {})
      }
      onPatch({
        ...block,
        src: asset.url,
        publicId: asset.publicId,
        ...(block.type === 'video'
          ? {}
          : { alt: block.alt.trim() ? block.alt : imageAltFromFileName(file.name) }),
      })
    } catch (err) {
      window.alert(err instanceof Error ? err.message : String(err))
    }
  }

  const onPosterFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (block.type !== 'video') return
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const asset = await uploadMediaClient({ file, folder: 'work/blocks/posters' })
      if (block.posterPublicId) {
        void deleteMediaByPublicId(block.posterPublicId).catch(() => {})
      }
      onPatch({ ...block, poster: asset.url, posterPublicId: asset.publicId })
    } catch (err) {
      window.alert(err instanceof Error ? err.message : String(err))
    }
  }

  const clearMedia = () => {
    if (block.publicId) {
      void deleteMediaByPublicId(block.publicId).catch(() => {})
    }
    if (block.type === 'video' && block.posterPublicId) {
      void deleteMediaByPublicId(block.posterPublicId).catch(() => {})
    }
    onPatch(
      block.type === 'video'
        ? { ...block, src: '', poster: '', alt: '', publicId: undefined, posterPublicId: undefined }
        : { ...block, src: '', alt: '', publicId: undefined },
    )
    if (fileRef.current) fileRef.current.value = ''
    if (posterRef.current) posterRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-white/70">{fileLabel}</Label>
        <p className="text-xs text-white/50">
          Upload from your computer to Cloudinary or paste a media URL below.
        </p>
        <Input
          ref={fileRef}
          type="file"
          accept={fileAccept}
          className={cn(
            'cursor-pointer border-white/15 bg-black/30 text-sm text-white file:mr-3 file:rounded-md',
            'file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-white',
          )}
          onChange={onFile}
        />
      </div>
      {block.src ? (
        <div className="flex flex-wrap items-start gap-3">
          <div
            className={cn(
              'relative shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/40',
              block.variant === 'hero' ? 'h-28 w-44' : 'aspect-video w-full max-w-md',
            )}
          >
            {block.type === 'video' ? (
              <MediaRenderer
                media={{ type: 'video', url: block.src, thumbnailUrl: block.poster, alt: block.alt }}
                className="size-full object-cover"
                controls={false}
                autoplay={false}
                variant="admin-preview"
              />
            ) : (
              <MediaRenderer
                media={{ type: block.type, url: block.src, alt: block.alt || 'Media preview' }}
                className="size-full object-cover"
                variant="admin-preview"
              />
            )}
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={clearMedia}>
            Remove media
          </Button>
        </div>
      ) : null}
      <div className="space-y-2">
        <Label className="text-white/70">{isVideo ? 'Media URL' : 'Image URL'}</Label>
        <Input
          value={block.src}
          onChange={(e) => onPatch({ ...block, src: e.target.value })}
          placeholder={isVideo ? 'https://.../video.mp4' : 'https://.../image.jpg'}
          className="border-white/15 bg-black/30 text-white"
        />
      </div>
      {block.type === 'video' ? (
        <>
          <div className="space-y-2">
            <Label className="text-white/70">Poster image (optional)</Label>
            <div className="flex gap-2">
              <Input
                value={block.poster ?? ''}
                onChange={(e) => onPatch({ ...block, poster: e.target.value })}
                placeholder="https://.../poster.jpg"
                className="border-white/15 bg-black/30 text-white"
              />
              <Input
                ref={posterRef}
                type="file"
                accept="image/*"
                className={cn(
                  'max-w-56 cursor-pointer border-white/15 bg-black/30 text-sm text-white file:mr-3 file:rounded-md',
                  'file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-white',
                )}
                onChange={onPosterFile}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input
                type="checkbox"
                checked={block.controls !== false}
                onChange={(e) => onPatch({ ...block, controls: e.target.checked })}
              />
              Show controls
            </label>
            <label className="flex items-center gap-2 text-sm text-white/75">
              <input
                type="checkbox"
                checked={Boolean(block.autoplay)}
                onChange={(e) => onPatch({ ...block, autoplay: e.target.checked })}
              />
              Autoplay muted loop
            </label>
          </div>
        </>
      ) : null}
      <div className="space-y-2">
        <Label className="text-white/70">{isVideo ? 'Fallback text (optional)' : 'Alt text'}</Label>
        <Input
          value={block.alt ?? ''}
          onChange={(e) => onPatch({ ...block, alt: e.target.value })}
          placeholder={isVideo ? 'Video description if playback fails' : 'Describe the image for accessibility'}
          className="border-white/15 bg-black/30 text-white"
        />
      </div>
    </div>
  )
}
