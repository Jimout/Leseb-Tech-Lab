import { Container, containerMaxWidthClass, containerPaddingClass } from '@/components/layout/container'
import { WorkDetailContentBlocks } from '@/components/work-detail-content-blocks'
import { WorkDetailHero } from '@/components/work-detail-hero'
import { WorkDetailVisitWebsiteBar } from '@/components/work-detail-visit-website-bar'
import { normalizeExternalUrl } from '@/lib/normalize-external-url'
import { WorkDetailSplitSection } from '@/components/work-detail-split-section'
import { defaultBodyForWork } from '@/lib/work-detail-resolve'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import type { WorkDetailContentBlock } from '@/lib/work-detail-content-blocks'
import { cn } from '@/lib/utils'

function remainingContentBlocks(
  blocks: ReadonlyArray<WorkDetailContentBlock> | undefined,
): WorkDetailContentBlock[] {
  if (!blocks?.length) return []

  const out: WorkDetailContentBlock[] = []
  let skippedFirstRich = false

  for (const block of blocks) {
    if (block.type === 'rich' && block.html?.trim() && !skippedFirstRich) {
      skippedFirstRich = true
      continue
    }
    if (block.type === 'image' && block.variant !== 'hero') continue
    if (block.type === 'video' || block.type === 'gif' || block.type === 'embed360') continue
    out.push(block)
  }

  return out
}

export function WorkDetailContent({ detail }: { detail: ResolvedWorkDetail }) {
  const {
    work,
    pageTitle,
    pageTitleLines,
    year,
    location,
    tags,
    body,
    descriptionNote,
    contentBlocks,
  } = detail

  const overview =
    descriptionNote?.trim() || body?.trim() || defaultBodyForWork(work)
  const useFlexibleBody = Boolean(contentBlocks?.length)
  const tailBlocks = useFlexibleBody ? remainingContentBlocks(contentBlocks) : []
  const visitHref = normalizeExternalUrl(detail.websiteUrl)
  const showVisitBar = Boolean(visitHref)

  return (
    <>
    <article
      className={cn(
        showVisitBar && 'pb-28 sm:pb-32',
        !showVisitBar && 'pb-16 sm:pb-20 md:pb-24 lg:pb-28',
        'pt-6 sm:pt-8 md:pt-9 lg:pt-10',
      )}
    >
      <WorkDetailHero
        work={work}
        pageTitle={pageTitle}
        pageTitleLines={pageTitleLines}
        year={year}
        location={location}
        tags={tags}
      />

      <div className={cn('mx-auto w-full', containerMaxWidthClass, containerPaddingClass)}>
        <WorkDetailSplitSection detail={detail} overview={overview} />
      </div>

      {tailBlocks.length > 0 ? (
        <Container className="pt-0">
          <WorkDetailContentBlocks blocks={tailBlocks} />
        </Container>
      ) : null}
    </article>
    {showVisitBar && detail.websiteUrl ? (
      <WorkDetailVisitWebsiteBar websiteUrl={detail.websiteUrl} />
    ) : null}
    </>
  )
}
