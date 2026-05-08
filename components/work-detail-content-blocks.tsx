import { MediaRenderer } from '@/components/media-renderer'
import { workDetailMainImageHeightClass } from '@/components/work-detail-hero'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { sanitizeInsightHtml } from '@/lib/sanitize-insight-html'
import { cn } from '@/lib/utils'

const heroSizes =
  '(max-width: 1024px) calc(100vw - 4rem), (max-width: 1536px) calc(100vw - 7rem), min(90vw, 1600px)'
const wideSizes = '(max-width: 1023px) 100vw, 90vw'

const richProseClass =
  'prose prose-sm max-w-none text-justify text-[13px] font-light leading-snug text-foreground/60 sm:text-sm [&_p]:mb-0 [&_p+p]:mt-3'

function RichRun({ blocks }: { blocks: Extract<WorkDetailContentBlock, { type: 'rich' }>[] }) {
  if (!blocks.length) return null
  const n = blocks.length
  /** One block = one paragraph column; two or more consecutive text blocks share a 2-column grid (2×2 for four). */
  const twoColumnGrid =
    'grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 lg:gap-x-10 xl:gap-x-12'
  const layoutClass = n >= 2 ? twoColumnGrid : 'space-y-6'

  return (
    <div className={cn(layoutClass)}>
      {blocks.map((b) => (
        <div
          key={b.id}
          className={richProseClass}
          dangerouslySetInnerHTML={{ __html: sanitizeInsightHtml(b.html) }}
        />
      ))}
    </div>
  )
}

function BlockImage({
  block,
}: {
  block: Extract<WorkDetailContentBlock, { type: 'image' | 'gif' | 'video' | 'embed360' }>
}) {
  const mediaNode = (
    <MediaRenderer
      media={
        block.type === 'embed360'
          ? { type: 'embed360', url: block.embedUrl, embedUrl: block.embedUrl, alt: block.title }
          : block.type === 'video'
            ? { type: 'video', url: block.src, thumbnailUrl: block.poster, alt: block.alt }
            : { type: block.type, url: block.src, alt: block.alt }
      }
      className={block.type === 'embed360' ? 'size-full border-0' : 'size-full object-cover'}
      sizes={block.variant === 'hero' ? heroSizes : wideSizes}
      controls={block.type === 'video' ? block.controls !== false : undefined}
      autoplay={block.type === 'video' ? Boolean(block.autoplay) : undefined}
    />
  )

  if (block.variant === 'hero') {
    return (
      <div className={workDetailMainImageHeightClass}>
        {mediaNode}
      </div>
    )
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-4xl">
      {mediaNode}
    </div>
  )
}

export function WorkDetailContentBlocks({ blocks }: { blocks: ReadonlyArray<WorkDetailContentBlock> }) {
  if (!blocks.length) return null

  const segments: Array<
    | { kind: 'rich'; items: Extract<WorkDetailContentBlock, { type: 'rich' }>[] }
    | { kind: 'image'; block: Extract<WorkDetailContentBlock, { type: 'image' | 'gif' | 'video' | 'embed360' }> }
  > = []

  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    if (b.type !== 'rich') {
      segments.push({ kind: 'image', block: b })
      i += 1
      continue
    }
    const items: Extract<WorkDetailContentBlock, { type: 'rich' }>[] = []
    while (i < blocks.length && blocks[i].type === 'rich') {
      items.push(blocks[i] as Extract<WorkDetailContentBlock, { type: 'rich' }>)
      i += 1
    }
    segments.push({ kind: 'rich', items })
  }

  return (
    <div className="mt-10 space-y-6 sm:mt-12 sm:space-y-8 md:space-y-10 lg:mt-14 lg:space-y-12">
      {segments.map((seg, idx) =>
        seg.kind === 'image' ? (
          <BlockImage key={seg.block.id} block={seg.block} />
        ) : (
          <RichRun key={`run-${seg.items[0]?.id ?? idx}`} blocks={seg.items} />
        ),
      )}
    </div>
  )
}
