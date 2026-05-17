'use client'

import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

import { AdminWorkRepeatableImages } from '@/components/admin/work/admin-work-repeatable-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { GalleryColumnCount, WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { cn } from '@/lib/utils'

const fieldClass = 'border-white/15 bg-background/30 text-white'

const COLUMN_OPTIONS: { value: GalleryColumnCount; label: string }[] = [
  { value: 1, label: '1 column' },
  { value: 2, label: '2 columns' },
  { value: 3, label: '3 columns' },
  { value: 4, label: '4 columns' },
]

function blockLabel(block: WorkDetailContentBlock): string {
  if (block.type === 'text') return 'Text section'
  if (block.type === 'gallery') return `Photo gallery · ${block.columns} col`
  if (block.type === 'button') return 'Link button'
  return 'Section'
}

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
  return (
    <div className={cn('rounded-md border border-white/10 bg-background/25 p-3', 'space-y-3')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-white/55">{blockLabel(block)}</span>
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
            title="Remove section"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {block.type === 'text' ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-white/70">Title (optional)</Label>
            <Input
              value={block.title ?? ''}
              onChange={(e) => onPatch({ ...block, title: e.target.value })}
              placeholder="Section headline"
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Description</Label>
            <Textarea
              value={block.description}
              onChange={(e) => onPatch({ ...block, description: e.target.value })}
              rows={4}
              placeholder="Paragraph shown beside the title on the project page"
              className={fieldClass}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'gallery' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70">Grid columns</Label>
            <div className="flex flex-wrap gap-2">
              {COLUMN_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  size="sm"
                  variant={block.columns === opt.value ? 'default' : 'secondary'}
                  onClick={() => onPatch({ ...block, columns: opt.value })}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Title (optional)</Label>
            <Input
              value={block.title ?? ''}
              onChange={(e) => onPatch({ ...block, title: e.target.value })}
              placeholder="Headline above the photos"
              className={fieldClass}
            />
          </div>
          <AdminWorkRepeatableImages
            label="Photos"
            description="Upload images — they flow in the column grid you chose."
            items={block.images}
            onChange={(images) => onPatch({ ...block, images })}
          />
          <div className="space-y-2">
            <Label className="text-white/70">Description (optional)</Label>
            <Textarea
              value={block.description ?? ''}
              onChange={(e) => onPatch({ ...block, description: e.target.value })}
              rows={3}
              placeholder="Copy below the photo grid"
              className={fieldClass}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'button' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/70">Button label</Label>
            <Input
              value={block.label}
              onChange={(e) => onPatch({ ...block, label: e.target.value })}
              placeholder="Visit website"
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Link URL</Label>
            <Input
              value={block.url}
              onChange={(e) => onPatch({ ...block, url: e.target.value })}
              placeholder="https://example.com"
              className={fieldClass}
              inputMode="url"
              autoComplete="url"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}



