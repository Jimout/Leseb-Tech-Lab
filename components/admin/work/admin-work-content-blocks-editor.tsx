'use client'

import { Film, Globe, ImageIcon, Plus, Type } from 'lucide-react'

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
    setDetail({ contentBlocks: next })
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
    <div className="space-y-4 rounded-xl border border-white/10 bg-black/15 p-4 sm:p-5">
      <div>
        <Label className="text-base text-white">Flexible page body</Label>
        <p className="mt-1.5 text-sm leading-relaxed text-white/60">
          Each <strong className="font-medium text-white/80">text block</strong> is one layout unit — usually a
          single paragraph. Images break the flow.{' '}
          <strong className="font-medium text-white/80">Consecutive text blocks</strong> sit in a{' '}
          <strong className="font-medium text-white/80">two-column</strong> grid from medium screens up (2 blocks
          = one row; 3–4 = wrap into rows). Use <span className="text-white/80">tall</span> or{' '}
          <span className="text-white/80">wide</span> images for full-width sections.
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
              { id: newContentBlockId(), type: 'rich', html: '<p></p>' },
            ])
          }
        >
          <Type className="size-4" />
          Paragraph block
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
                type: 'image',
                src: '',
                alt: '',
                variant: 'hero',
              },
            ])
          }
        >
          <ImageIcon className="size-4" />
          Tall image
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
                type: 'gif',
                src: '',
                alt: '',
                variant: 'hero',
              },
            ])
          }
        >
          <ImageIcon className="size-4" />
          Tall GIF
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
                type: 'image',
                src: '',
                alt: '',
                variant: 'wide',
              },
            ])
          }
        >
          <Plus className="size-4" />
          Wide image
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
                type: 'video',
                src: '',
                poster: '',
                alt: '',
                variant: 'wide',
                controls: true,
                autoplay: false,
              },
            ])
          }
        >
          <Film className="size-4" />
          Video block
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
                type: 'embed360',
                embedUrl: '',
                title: '',
                variant: 'wide',
              },
            ])
          }
        >
          <Globe className="size-4" />
          360 embed
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
          <p className="text-sm text-white/45">No blocks yet — add text or images above.</p>
        ) : null}
      </div>
    </div>
  )
}
