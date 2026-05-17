'use client'

import { ExternalLink, ImageIcon, Type } from 'lucide-react'

import { AdminWorkContentBlockRow } from '@/components/admin/work/admin-work-content-block-row'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { newContentBlockId } from '@/lib/work-detail-content-blocks'
import type { WorkDetailPatch } from '@/lib/work-admin-types'

function swap<T>(arr: T[], i: number, j: number): T[] {
  if (j < 0 || j >= arr.length) return arr
  const next = [...arr]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

export function AdminWorkContentBlocksEditor({
  blocks,
  setDetail,
}: {
  blocks: WorkDetailContentBlock[]
  setDetail: (patch: Partial<WorkDetailPatch>) => void
}) {
  const setBlocks = (next: WorkDetailContentBlock[]) => {
    setDetail({
      contentBlocks: next,
      storyVideoTitle: '',
      storyVideoDescription: '',
      storyGalleryImages: [],
      storyGalleryTitle: '',
      storyGalleryDescription: '',
    })
  }

  const patchAt = (i: number, b: WorkDetailContentBlock) => {
    const next = [...blocks]
    next[i] = b
    setBlocks(next)
  }

  const removeAt = (i: number) => {
    setBlocks(blocks.filter((_, j) => j !== i))
  }

  const move = (i: number, dir: -1 | 1) => {
    setBlocks(swap(blocks, i, i + dir))
  }

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-background/15 p-4 sm:p-5">
      <div>
        <Label className="text-base text-white">Below the video</Label>
        <p className="mt-1.5 text-sm leading-relaxed text-white/60">
          Add sections in order — text (title + description), photo grids (pick column count), or a
          link button like “Visit website”. Drag order with the arrows on each section.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            setBlocks([
              ...blocks,
              { id: newContentBlockId(), type: 'text', title: '', description: '' },
            ])
          }
        >
          <Type className="size-4" />
          Text section
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            setBlocks([
              ...blocks,
              {
                id: newContentBlockId(),
                type: 'gallery',
                title: '',
                description: '',
                columns: 2,
                images: [],
              },
            ])
          }
        >
          <ImageIcon className="size-4" />
          Photo gallery
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            setBlocks([
              ...blocks,
              {
                id: newContentBlockId(),
                type: 'button',
                label: 'Visit website',
                url: '',
              },
            ])
          }
        >
          <ExternalLink className="size-4" />
          Link button
        </Button>
      </div>

      <div className="space-y-4 pt-2">
        {blocks.map((b, i) => (
          <AdminWorkContentBlockRow
            key={b.id}
            block={b}
            index={i}
            total={blocks.length}
            onPatch={(next) => patchAt(i, next)}
            onRemove={() => removeAt(i)}
            onMove={(dir) => move(i, dir)}
          />
        ))}

        {!blocks.length ? (
          <p className="text-sm text-white/45">No sections yet — add text, photos, or a link above.</p>
        ) : null}
      </div>
    </div>
  )
}

