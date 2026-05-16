'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { MediaRenderer } from '@/components/media-renderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cloudinaryPublicIdFromUrl, imageAltFromFileName } from '@/lib/media-assets'
import { deleteMediaByPublicId, uploadMediaClient } from '@/lib/media-upload-client'
import { cn } from '@/lib/utils'

type Props = {
  mediaUrl: string
  mediaAlt: string
  onMediaUrl: (v: string) => void
  onMediaAlt: (v: string) => void
  /** Default `insight` — only changes the help copy. */
  context?: 'insight' | 'work'
}

export function AdminInsightHeroImageField({
  mediaUrl,
  mediaAlt,
  onMediaUrl,
  onMediaAlt,
  context = 'insight',
}: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [dragOver, setDragOver] = React.useState(false)

  const handleFileUpload = async (file: File | null) => {
    if (!file) return
    try {
      setUploading(true)
      setProgress(0)
      const asset = await uploadMediaClient({
        file,
        folder: context === 'work' ? 'work/hero' : 'insights/hero',
        onProgress: setProgress,
      })
      const oldPublicId = cloudinaryPublicIdFromUrl(mediaUrl)
      if (oldPublicId) void deleteMediaByPublicId(oldPublicId).catch(() => {})
      onMediaUrl(asset.url)
      if (!mediaAlt.trim()) onMediaAlt(imageAltFromFileName(file.name))
    } catch (err) {
      window.alert(err instanceof Error ? err.message : String(err))
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    await handleFileUpload(file)
  }

  const showUrlFallback = context !== 'work'
  const urlValue = mediaUrl.startsWith('data:') ? '' : mediaUrl

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white/80">Hero image — choose file</Label>
        <p className="text-xs text-white/55">
          Uploads to Cloudinary and stores only media URL + metadata with this{' '}
          {context === 'work' ? 'work entry' : 'insight'}.
          {showUrlFallback ? (
            <>
              {' '}
              For production, add the file under <code className="text-white/80">public/images/</code>{' '}
              and use the path below instead.
            </>
          ) : null}
        </p>
        <Input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={cn(
            'cursor-pointer border-white/15 bg-background/30 text-sm text-white file:mr-3 file:rounded-md',
            'file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-white',
          )}
          onChange={onFile}
        />
        <div
          className={cn(
            'rounded-md border border-dashed px-3 py-2 text-xs transition-colors',
            dragOver ? 'border-white/40 bg-white/10 text-white/95' : 'border-white/15 text-white/60',
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const dropped = e.dataTransfer.files?.[0]
            void handleFileUpload(dropped ?? null)
          }}
        >
          Drag and drop an image here
        </div>
        {uploading ? <p className="text-xs text-white/60">Uploading... {progress}%</p> : null}
        {mediaUrl ? (
          <div className="flex flex-wrap items-start gap-3">
            <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-background/40">
              <MediaRenderer
                media={{ type: 'image', url: mediaUrl, alt: mediaAlt || 'Hero preview' }}
                className="size-full object-cover"
                variant="admin-preview"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Remove image"
              title="Remove image"
              onClick={() => {
                const oldPublicId = cloudinaryPublicIdFromUrl(mediaUrl)
                if (oldPublicId) void deleteMediaByPublicId(oldPublicId).catch(() => {})
                onMediaUrl('')
                if (fileRef.current) fileRef.current.value = ''
              }}
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        ) : null}
      </div>

      {showUrlFallback ? (
        <div className="space-y-2">
          <Label className="text-white/80">Or hero image URL / path</Label>
          <Input
            value={urlValue}
            onChange={(e) => onMediaUrl(e.target.value)}
            placeholder="/images/my-photo.jpg or https://…"
            className="border-white/15 bg-background/30 text-white"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label className="text-white/80">Hero image alt text</Label>
        <Input
          value={mediaAlt}
          onChange={(e) => onMediaAlt(e.target.value)}
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
    </div>
  )
}
