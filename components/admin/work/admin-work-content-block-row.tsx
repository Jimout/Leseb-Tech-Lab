'use client'

import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

import { AdminRichTextEditor } from '@/components/admin/admin-rich-text-editor'
import { AdminWorkContentBlockImageFields } from '@/components/admin/work/admin-work-content-block-image-fields'
import { Button } from '@/components/ui/button'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { cn } from '@/lib/utils'

export function AdminWorkContentBlockRow({
  block,
  index,
  total,
  onPatch,
  onRemove,
  onMove,
}: {
  block: WorkDetailContentBlock
  index: number
  total: number
  onPatch: (b: WorkDetailContentBlock) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}) {
  const label =
    block.type === 'rich'
      ? 'Paragraph'
      : block.type === 'embed360'
        ? block.variant === 'hero'
          ? 'Tall 360 embed'
          : 'Wide 360 embed'
      : block.type === 'video'
        ? block.variant === 'hero'
          ? 'Tall video'
          : 'Wide video'
        : block.type === 'gif'
          ? block.variant === 'hero'
            ? 'Tall GIF'
            : 'Wide GIF'
          : block.variant === 'hero'
            ? 'Tall image'
            : 'Wide image'

  return (
    <div
      className={cn(
        'rounded-md border border-white/10 bg-background/25 p-3',
        'space-y-3',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-white/55">{label}</span>
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-white/80"
            title="Move up"
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-white/80"
            title="Move down"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-red-400/90"
            title="Remove block"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {block.type === 'rich' ? (
        <AdminRichTextEditor
          value={block.html}
          onChange={(html) => onPatch({ ...block, html })}
          minHeightClass="min-h-[160px]"
        />
      ) : block.type === 'embed360' ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Embed URL</label>
            <input
              value={block.embedUrl}
              onChange={(e) => onPatch({ ...block, embedUrl: e.target.value })}
              placeholder="https://my.matterport.com/show/?m=..."
              className="w-full rounded-md border border-white/15 bg-background/30 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Title (optional)</label>
            <input
              value={block.title ?? ''}
              onChange={(e) => onPatch({ ...block, title: e.target.value })}
              placeholder="360 preview"
              className="w-full rounded-md border border-white/15 bg-background/30 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>
      ) : (
        <AdminWorkContentBlockImageFields block={block} onPatch={onPatch} />
      )}
    </div>
  )
}
