import { Container, containerMaxWidthClass, containerPaddingClass } from '@/components/layout/container'
import { WorkDetailHero } from '@/components/work-detail-hero'
import { WorkDetailVisitWebsiteBar } from '@/components/work-detail-visit-website-bar'
import { normalizeExternalUrl } from '@/lib/normalize-external-url'
import { WorkDetailSplitSection } from '@/components/work-detail-split-section'
import { defaultBodyForWork } from '@/lib/work-detail-resolve'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { cn } from '@/lib/utils'

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
  } = detail

  const overview =
    descriptionNote?.trim() || body?.trim() || defaultBodyForWork(work)
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
      </article>
      {showVisitBar && detail.websiteUrl ? (
        <WorkDetailVisitWebsiteBar websiteUrl={detail.websiteUrl} />
      ) : null}
    </>
  )
}
