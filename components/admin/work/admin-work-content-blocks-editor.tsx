'use client'

import { ExternalLink, ImageIcon, Type } from 'lucide-react'

import { AdminWorkContentBlockRow } from '@/components/admin/work/admin-work-content-block-row'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { newContentBlockId } from '@/lib/work-detail-content-blocks'
import type { WorkDetailPatch } from '@/lib/work-admin-types'
import { cn } from '@/lib/utils'

function swap<T>(arr: T[], i: number, j: number): T[] {
  if (j < 0 || j >= arr.length) return arr
  const next = [...arr]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

function AddSectionToolbar({
  onAdd,
  className,
}: {
  onAdd: (block: WorkDetailContentBlock) => void
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Add a section</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            onAdd({ id: newContentBlockId(), type: 'text', title: '', description: '' })
          }
        >
          <Type className="size-4" aria-hidden />
          Text section
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            onAdd({
              id: newContentBlockId(),
              type: 'gallery',
              title: '',
              description: '',
              columns: 2,
              images: [],
            })
          }
        >
          <ImageIcon className="size-4" aria-hidden />
          Photo gallery
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            onAdd({
              id: newContentBlockId(),
              type: 'button',
              label: 'Visit website',
              url: '',
            })
          }
        >
          <ExternalLink className="size-4" aria-hidden />
          Link button
        </Button>
      </div>
    </div>
  )
}

export function AdminWorkContentBlocksEditor({
  blocks,
  setDetail,
  embedded = false,
}: {
  blocks: WorkDetailContentBlock[]
  setDetail: (patch: Partial<WorkDetailPatch>) => void
  /** When true, omit outer panel chrome (used inside create-form sections). */
  embedded?: boolean
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

  const addBlock = (block: WorkDetailContentBlock) => {
    setBlocks([block, ...blocks])
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
    <div
      className={
        embedded
          ? 'space-y-4'
          : 'space-y-4 rounded-xl border border-white/10 bg-background/15 p-4 sm:p-5'
      }
    >
      {!embedded ? (
        <div>
          <Label className="text-base text-white">Page sections</Label>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">
            Add text, photo grids, or link buttons. Each new section opens directly under the add
            buttons — use the arrows to set order on the live page.
          </p>
        </div>
      ) : null}

      <AddSectionToolbar onAdd={addBlock} />

      <div className="space-y-4 border-t border-white/10 pt-4">
        {blocks.length === 0 ? (
          <p className="text-sm text-white/45">
            No sections yet — choose text, photos, or a link above.
          </p>
        ) : (
          blocks.map((b, i) => (
            <AdminWorkContentBlockRow
              key={b.id}
              block={b}
              index={i}
              total={blocks.length}
              onPatch={(next) => patchAt(i, next)}
              onRemove={() => removeAt(i)}
              onMove={(dir) => move(i, dir)}
            />
          ))
        )}
      </div>
    </div>
  )
}
