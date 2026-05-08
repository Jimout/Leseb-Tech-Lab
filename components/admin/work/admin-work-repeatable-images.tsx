'use client'

import * as React from 'react'

import { MediaRenderer } from '@/components/media-renderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { imageAltFromFileName } from '@/lib/media-assets'
import { deleteMediaByPublicId, uploadMediaClient } from '@/lib/media-upload-client'
import { cn } from '@/lib/utils'

export type ImagePair = { src: string; alt: string; publicId?: string }

type RowProps = {
  value: ImagePair
  onChange: (next: ImagePair) => void
  onRemove: () => void
}

function AdminWorkImagePairRow({ value, onChange, onRemove }: RowProps) {
  const fileRef = React.useRef<HTMLInputElement>(null)

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const asset = await uploadMediaClient({ file, folder: 'work/gallery' })
      if (value.publicId) {
        void deleteMediaByPublicId(value.publicId).catch(() => {})
      }
      onChange({
        src: asset.url,
        alt: value.alt.trim() ? value.alt : imageAltFromFileName(file.name),
        publicId: asset.publicId,
      })
    } catch (err) {
      window.alert(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="space-y-2">
        <Label className="text-white/70">Image file</Label>
        <p className="text-xs text-white/50">Uploaded to Cloudinary; this entry stores URL metadata only.</p>
        <Input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={cn(
            'cursor-pointer border-white/15 bg-black/30 text-sm text-white file:mr-3 file:rounded-md',
            'file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-white',
          )}
          onChange={onFile}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/70">Alt text</Label>
        <Input
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          className="border-white/15 bg-black/30 text-white"
        />
      </div>
      {value.src ? (
        <div className="relative h-24 w-40 overflow-hidden rounded-md border border-white/15">
          <MediaRenderer
            media={{ type: 'image', url: value.src, alt: value.alt || 'Gallery preview' }}
            className="size-full object-cover"
            variant="admin-preview"
          />
        </div>
      ) : null}
      <Button type="button" variant="secondary" size="sm" onClick={onRemove}>
        Remove row
      </Button>
    </div>
  )
}

export function AdminWorkRepeatableImages({
  label,
  description,
  items,
  onChange,
}: {
  label: string
  description?: string
  items: ImagePair[]
  onChange: (next: ImagePair[]) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base text-white">{label}</Label>
        {description ? <p className="mt-1 text-sm text-white/55">{description}</p> : null}
      </div>
      <div className="space-y-4">
        {items.map((it, i) => (
          <AdminWorkImagePairRow
            key={i}
            value={it}
            onChange={(next) => onChange(items.map((x, j) => (j === i ? next : x)))}
            onRemove={() => {
              if (it.publicId) void deleteMediaByPublicId(it.publicId).catch(() => {})
              onChange(items.filter((_, j) => j !== i))
            }}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { src: '', alt: '', publicId: undefined }])}
      >
        Add image
      </Button>
    </div>
  )
}
