'use client'

import { useId } from 'react'
import { Upload, X } from 'lucide-react'

import { MediaRenderer } from '@/components/media-renderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cloudinaryPublicIdFromUrl } from '@/lib/media-assets'
import { deleteMediaByPublicId, uploadMediaClient } from '@/lib/media-upload-client'
import { cn } from '@/lib/utils'

export function ImageUploadField({
  label,
  value,
  onChange,
  aspectClassName = 'aspect-3/4',
  className,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  aspectClassName?: string
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white/85">{label}</p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="h-8 w-8 p-0" asChild>
            <label htmlFor={id} className="cursor-pointer" aria-label="Upload image" title="Upload image">
              <Upload className="size-4" aria-hidden />
            </label>
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              const publicId = cloudinaryPublicIdFromUrl(value)
              if (publicId) void deleteMediaByPublicId(publicId).catch(() => {})
              onChange('')
            }}
            disabled={!value}
            aria-label="Clear image"
            title="Clear image"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <Input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          try {
            const asset = await uploadMediaClient({ file: f, folder: 'site' })
            const oldPublicId = cloudinaryPublicIdFromUrl(value)
            if (oldPublicId) void deleteMediaByPublicId(oldPublicId).catch(() => {})
            onChange(asset.url)
          } catch (err) {
            // eslint-disable-next-line no-alert
            alert((err as Error).message)
          } finally {
            e.target.value = ''
          }
        }}
      />

      <div className={cn('relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/5', aspectClassName)}>
        {value ? (
          <MediaRenderer
            media={{ type: 'image', url: value, alt: `${label} preview` }}
            className="size-full object-contain object-center"
            variant="admin-preview"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-sm text-white/55">
            No image selected
          </div>
        )}
      </div>
    </div>
  )
}

