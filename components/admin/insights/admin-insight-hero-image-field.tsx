'use client'

import * as React from 'react'
import { Upload, X } from 'lucide-react'

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
  onUploadingChange?: (uploading: boolean) => void
  onError?: (message: string) => void
  /** Default `insight` — only changes the help copy. */
  context?: 'insight' | 'work'
  /** Manual URL / path field (off by default for insights). */
  allowUrlInput?: boolean
  required?: boolean
}

export function AdminInsightHeroImageField({
  mediaUrl,
  mediaAlt,
  onMediaUrl,
  onMediaAlt,
  onUploadingChange,
  onError,
  context = 'insight',
  allowUrlInput = false,
  required = false,
}: Props) {
  const fileInputId = React.useId()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [dragOver, setDragOver] = React.useState(false)

  const setUploadingState = React.useCallback(
    (next: boolean) => {
      setUploading(next)
      onUploadingChange?.(next)
    },
    [onUploadingChange],
  )

  const reportError = React.useCallback(
    (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Upload failed. Try again.'
      onError?.(message)
    },
    [onError],
  )

  const handleFileUpload = async (file: File | null) => {
    if (!file) return
    try {
      setUploadingState(true)
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
      reportError(err)
    } finally {
      setUploadingState(false)
      setProgress(0)
    }
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    await handleFileUpload(file ?? null)
  }

  const showUrlFallback = allowUrlInput
  const urlValue = mediaUrl.startsWith('data:') ? '' : mediaUrl
  const labelSuffix = required ? ' *' : ''
  const fieldInputClass = 'border-white/15 bg-background/30 text-white'

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white/80">
          Hero image{labelSuffix}
        </Label>
        <p className="text-xs text-white/55">
          Upload an image file (PNG, JPEG, WebP, GIF, or AVIF) for this{' '}
          {context === 'work' ? 'work entry' : 'insight'}.
        </p>
        <div className="flex w-full flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-9 gap-1.5"
            disabled={uploading}
            asChild
          >
            <label htmlFor={fileInputId} className="cursor-pointer">
              <Upload className="size-4" aria-hidden />
              Choose file
            </label>
          </Button>
          {mediaUrl ? (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="size-9 shrink-0"
              disabled={uploading}
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
          ) : null}
        </div>
        <Input
          id={fileInputId}
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="sr-only"
          onChange={onFile}
        />
        <div
          className={cn(
            'w-full rounded-md border border-dashed px-3 py-3 text-xs transition-colors',
            dragOver ? 'border-white/40 bg-white/10 text-white/95' : 'border-white/15 text-white/60',
            uploading && 'pointer-events-none opacity-60',
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
        {uploading ? <p className="text-xs text-white/60">Uploading… {progress}%</p> : null}
        {mediaUrl ? (
          <div className="relative h-28 w-full max-w-xs overflow-hidden rounded-lg border border-white/15 bg-background/40">
            <MediaRenderer
              media={{ type: 'image', url: mediaUrl, alt: mediaAlt || 'Hero preview' }}
              className="size-full object-cover"
              variant="admin-preview"
            />
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
            className={fieldInputClass}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label className="text-white/80">
          Hero image alt text{labelSuffix}
        </Label>
        <Input
          value={mediaAlt}
          onChange={(e) => onMediaAlt(e.target.value)}
          placeholder="Describe the image for accessibility"
          className={fieldInputClass}
          required={required}
        />
      </div>
    </div>
  )
}
