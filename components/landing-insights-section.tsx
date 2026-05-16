'use client'

import * as React from 'react'

import { FluidSplitButton } from '@/components/fluid-split-button'
import {
  InsightLandingCard,
  insightLandingCardStripWidthClass,
  primaryInsightCategory,
  useInsightFilterLabelMap,
} from '@/components/insight-landing-card'
import { StripPagination } from '@/components/strip-pagination'
import { useDragScrollX } from '@/hooks/use-drag-scroll-x'
import { useHorizontalStripPagination } from '@/hooks/use-horizontal-strip-pagination'
import { useInsightsShowcaseMerged } from '@/hooks/use-insights-showcase-merged'
import { SHOWCASE_INSIGHTS } from '@/lib/insights-showcase-data'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
  landingStripBleedClass,
} from '@/lib/landing-page-layout'
import {
  landingBandClass,
  landingInsightStripClass,
  landingSectionHeaderSplitClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleAccentClass,
  landingSectionTitleClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

const LANDING_INSIGHTS_LIMIT = 6

export function LandingInsightsSection() {
  const remoteItems = useInsightsShowcaseMerged()
  const filterLabels = useInsightFilterLabelMap()
  const dragScroll = useDragScrollX({ mouseOnly: true })
  const slice = React.useMemo(() => {
    const source = remoteItems.length > 0 ? remoteItems : SHOWCASE_INSIGHTS
    return source.slice(0, LANDING_INSIGHTS_LIMIT)
  }, [remoteItems])
  const { ref: stripRef, page, totalPages, goToPage } = useHorizontalStripPagination(slice.length)

  return (
    <section
      id="insights"
      data-nav-surface="dark"
      className={cn('scroll-mt-24 py-0', landingBandClass, landingPageGutterClass)}
    >
      <div className={cn('mx-auto min-w-0', landingPageContentMaxClass)}>
        <div className={landingSectionHeaderSplitClass}>
          <div className="min-w-0">
            <div className={cn('mb-4', landingSectionKickerClass)}>
              <span className={landingSectionKickerDotClass} aria-hidden />
              Insights
            </div>
            <h2 className={landingSectionTitleClass}>
              <span className="block">Discover</span>
              <span className="block">
                what&apos;s <span className={landingSectionTitleAccentClass}>on.</span>
              </span>
            </h2>
          </div>
          <div className="shrink-0 md:pb-1 md:self-end">
            <FluidSplitButton label="View all insights" href="/insights" variant="secondary" size="navbar" />
          </div>
        </div>

        <div className={cn('min-w-0', landingStripBleedClass)}>
          <div
            ref={stripRef}
            role="region"
            aria-label="Featured insights"
            className={landingInsightStripClass}
            onPointerDown={dragScroll.onPointerDown}
            onPointerMove={dragScroll.onPointerMove}
            onPointerUp={dragScroll.onPointerUp}
            onPointerCancel={dragScroll.onPointerCancel}
            onClickCapture={dragScroll.onClickCapture}
          >
            {slice.map((item, i) => {
              const cat = primaryInsightCategory(item, filterLabels)
              return (
                <InsightLandingCard
                  key={item.id}
                  item={item}
                  categoryPill={cat.pill}
                  categoryMeta={cat.meta}
                  className={insightLandingCardStripWidthClass}
                  imageSizes="(max-width: 768px) 82vw, 320px"
                />
              )
            })}
          </div>
        </div>

        <StripPagination
          className="mt-8 sm:mt-10"
          currentPage={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </section>
  )
}
