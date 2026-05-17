import { MediaRenderer } from '@/components/media-renderer'
import { WorkDetailFillImage } from '@/components/work-detail-fill-image'
import { WorkDetailProjectFacts } from '@/components/work-detail-project-facts'
import { WorkDetailStoryVideo } from '@/components/work-detail-story-video'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { sanitizeInsightHtml } from '@/lib/sanitize-insight-html'
import {
  workDetailSplitBodyClass,
  workDetailSplitSecondaryClass,
  workDetailSplitTitleClass,
} from '@/lib/work-detail-typography'
import { cn } from '@/lib/utils'

const gallerySizes = '(max-width: 1024px) 100vw, 42vw'

type GalleryItem =
  | { kind: 'image'; src: string; alt: string }
  | {
      kind: 'video' | 'gif' | 'embed360'
      block: Extract<WorkDetailContentBlock, { type: 'video' | 'gif' | 'embed360' }>
    }

function collectGalleryItems(detail: ResolvedWorkDetail): GalleryItem[] {
  const items: GalleryItem[] = []

  if (detail.secondaryHeroImage?.src?.trim()) {
    items.push({
      kind: 'image',
      src: detail.secondaryHeroImage.src,
      alt: detail.secondaryHeroImage.alt,
    })
  }

  for (const img of detail.descriptionBelowImages ?? []) {
    if (img.src?.trim()) items.push({ kind: 'image', src: img.src, alt: img.alt })
  }

  for (const img of detail.additionalImages ?? []) {
    if (img.src?.trim()) items.push({ kind: 'image', src: img.src, alt: img.alt })
  }

  return items
}

function firstLegacyRichOverview(blocks: ReadonlyArray<WorkDetailContentBlock> | undefined): string | null {
  const rich = blocks?.find((b) => b.type === 'rich' && b.html?.trim())
  return rich?.type === 'rich' ? rich.html : null
}

function GalleryMedia({ item }: { item: GalleryItem }) {
  if (item.kind === 'image') {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-image-well sm:rounded-3xl">
        <WorkDetailFillImage src={item.src} alt={item.alt} sizes={gallerySizes} />
      </div>
    )
  }

  const block = item.block
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-image-well sm:rounded-3xl">
      <MediaRenderer
        media={
          block.type === 'embed360'
            ? { type: 'embed360', url: block.embedUrl, embedUrl: block.embedUrl, alt: block.title }
            : block.type === 'video'
              ? { type: 'video', url: block.src, thumbnailUrl: block.poster, alt: block.alt }
              : { type: 'gif', url: block.src, alt: block.alt }
        }
        className={block.type === 'embed360' ? 'size-full border-0' : 'size-full object-cover'}
        sizes={gallerySizes}
        controls={block.type === 'video' ? block.controls !== false : undefined}
        autoplay={block.type === 'video' ? Boolean(block.autoplay) : undefined}
      />
    </div>
  )
}

type WorkDetailSplitSectionProps = {
  detail: ResolvedWorkDetail
  overview: string
}

export function WorkDetailSplitSection({ detail, overview }: WorkDetailSplitSectionProps) {
  const { pageTitle, pageTitleLines, secondaryImageDescriptionColumns } = detail

  const gallery = collectGalleryItems(detail)
  const secondaryParagraphs = (secondaryImageDescriptionColumns ?? [])
    .map((p) => p.trim())
    .filter(Boolean)

  const overviewHtml = firstLegacyRichOverview(detail.contentBlocks)
  const showHtmlOverview = Boolean(overviewHtml)

  return (
    <section className="mt-12 sm:mt-14 md:mt-16 lg:mt-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-10 lg:gap-x-14 xl:gap-x-16">
        <div className="flex min-w-0 flex-col gap-8 md:col-span-5 lg:col-span-5">
          <div>
            {pageTitleLines ? (
              <h2 className={workDetailSplitTitleClass}>
                <span className="block">{pageTitleLines[0]}</span>
                <span className="mt-1 block sm:mt-1.5">{pageTitleLines[1]}</span>
              </h2>
            ) : (
              <h2 className={workDetailSplitTitleClass}>{pageTitle}</h2>
            )}
          </div>

          {gallery.length > 0 ? (
            <div className="flex flex-col gap-5 sm:gap-6">
              {gallery.map((item, index) => (
                <GalleryMedia key={`${item.kind}-${index}`} item={item} />
              ))}
            </div>
          ) : null}

          {secondaryParagraphs.length > 0 ? (
            <div className="space-y-4 border-t border-border/80 pt-6 sm:pt-8">
              {secondaryParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`} className={workDetailSplitSecondaryClass}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col md:col-span-7 lg:col-span-7">
          {showHtmlOverview ? (
            <div
              className={cn(workDetailSplitBodyClass, 'prose prose-invert max-w-none [&_p]:mb-0 [&_p+p]:mt-4')}
              dangerouslySetInnerHTML={{ __html: sanitizeInsightHtml(overviewHtml!) }}
            />
          ) : (
            <p className={workDetailSplitBodyClass}>{overview}</p>
          )}
          <WorkDetailProjectFacts
            client={detail.client}
            industry={detail.industry}
            duration={detail.duration}
          />
        </div>
      </div>
      <WorkDetailStoryVideo detail={detail} />
    </section>
  )
}
