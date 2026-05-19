'use client'

import * as React from 'react'

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
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
  landingSectionYClass,
  landingStripBleedClass,
} from '@/lib/landing-page-layout'
import {
  landingInsightStripClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleAccentClass,
  landingSectionTitleClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export function InsightDetailRelated({ excludeId }: { excludeId: string }) {
  const insights = useInsightsShowcaseMerged()
  const filterLabels = useInsightFilterLabelMap()
  const dragScroll = useDragScrollX({ mouseOnly: true })

  const items = React.useMemo(
    () => insights.filter((item) => item.id !== excludeId),
    [excludeId, insights],
  )

  const { ref: stripRef, page, totalPages, goToPage } = useHorizontalStripPagination(items.length)

  if (!items.length) return null

  return (
    <section
      className={cn(
        landingSectionYClass,
        landingPageGutterClass,
        'overflow-x-clip border-t border-foreground/10',
      )}
      aria-labelledby="insight-related-heading"
    >
      <div className={cn('mx-auto min-w-0', landingPageContentMaxClass)}>
        <header className="mb-10 sm:mb-12 md:mb-14">
          <p className={cn('mb-4', landingSectionKickerClass)}>
            <span className={landingSectionKickerDotClass} aria-hidden />
            More to read
          </p>
          <h2 id="insight-related-heading" className={landingSectionTitleClass}>
            <span className="block">You might also</span>
            <span className="block">
              <span className={landingSectionTitleAccentClass}>like.</span>
            </span>
          </h2>
        </header>

        <div className={cn('min-w-0', landingStripBleedClass)}>
          <div
            ref={stripRef}
            role="region"
            aria-label="Related insights"
            className={landingInsightStripClass}
            onPointerDown={dragScroll.onPointerDown}
            onPointerMove={dragScroll.onPointerMove}
            onPointerUp={dragScroll.onPointerUp}
            onPointerCancel={dragScroll.onPointerCancel}
            onClickCapture={dragScroll.onClickCapture}
          >
            {items.map((item) => {
              const cat = primaryInsightCategory(item, filterLabels)
              return (
                <InsightLandingCard
                  key={item.id}
                  item={item}
                  categoryPill={cat.pill}
                  categoryMeta={cat.meta}
                  className={insightLandingCardStripWidthClass}
                  imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
