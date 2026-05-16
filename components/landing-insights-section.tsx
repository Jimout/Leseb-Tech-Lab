'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { MediaRenderer } from '@/components/media-renderer'
import { StripPagination } from '@/components/strip-pagination'
import { useDragScrollX } from '@/hooks/use-drag-scroll-x'
import { useHorizontalStripPagination } from '@/hooks/use-horizontal-strip-pagination'
import { useInsightsShowcaseMerged } from '@/hooks/use-insights-showcase-merged'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { SHOWCASE_INSIGHTS, type ShowcaseInsight } from '@/lib/insights-showcase-data'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
  landingSectionYClass,
  landingStripBleedClass,
} from '@/lib/landing-page-layout'
import {
  landingBandClass,
  landingEmptyCoverClass,
  landingInsightCardClass,
  landingInsightCardCtaClass,
  landingInsightCardFooterClass,
  landingInsightCardMediaDescClass,
  landingInsightCardMediaTitleClass,
  landingInsightCardPillClass,
  landingInsightCardWidthClass,
  landingInsightStripClass,
  landingPanelEaseClass,
  landingSectionHeaderSplitClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleAccentClass,
  landingSectionTitleClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

function useFilterLabelMap(): Map<string, string> {
  const { settings } = useSiteSettings()
  return React.useMemo(() => {
    const m = new Map<string, string>()
    for (const e of settings.portfolioCatalogFilters.workInsights) {
      if (e.id !== 'all') m.set(e.id, e.label)
    }
    return m
  }, [settings.portfolioCatalogFilters.workInsights])
}

function primaryCategory(
  item: ShowcaseInsight,
  labels: Map<string, string>,
): { pill: string; meta: string } {
  for (const id of item.filterIds) {
    const l = labels.get(id)
    if (l) return { pill: l.toUpperCase(), meta: l }
  }
  return { pill: 'INSIGHT', meta: 'Insights' }
}

function LandingInsightCard({
  item,
  categoryPill,
  categoryMeta,
}: {
  item: ShowcaseInsight
  categoryPill: string
  categoryMeta: string
}) {
  const hasCover = Boolean(item.heroMedia?.url?.trim())

  return (
    <Link
      href={item.href}
      draggable={false}
      className={cn(landingInsightCardWidthClass, landingInsightCardClass)}
    >
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-image-well">
        {!hasCover ? (
          <div className="absolute inset-0 flex items-center justify-center bg-image-well" aria-hidden>
            <span className={landingEmptyCoverClass}>No cover</span>
          </div>
        ) : (
          <MediaRenderer
            media={item.heroMedia!}
            className={cn(
              'absolute inset-0 size-full object-cover object-center',
              'transition-transform duration-500 motion-reduce:transition-none',
              'group-hover:scale-[1.03] motion-reduce:group-hover:scale-100',
              landingPanelEaseClass,
            )}
            sizes="(max-width: 768px) 82vw, 320px"
            controls={false}
            autoplay={false}
          />
        )}
        <span className={landingInsightCardPillClass}>{categoryPill}</span>
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-linear-to-t from-background/88 via-background/45 to-transparent px-3.5 pb-3.5 pt-16 sm:px-4 sm:pb-4 sm:pt-20">
          <h3 className={landingInsightCardMediaTitleClass}>{item.title}</h3>
          <p className={landingInsightCardMediaDescClass}>{item.description}</p>
        </div>
      </div>

      <div className={landingInsightCardFooterClass}>
        <div className="relative min-w-0">
          <p className="text-[11px] font-semibold text-foreground transition-colors duration-500 group-hover:text-signal sm:text-xs">
            {item.date}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-foreground/60 transition-colors duration-500 group-hover:text-foreground/85 sm:text-[11px]">
            {categoryMeta}
          </p>
        </div>
        <span className={landingInsightCardCtaClass}>
          Read
          <ArrowUpRight
            strokeWidth={2}
            className="size-3 text-signal transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 sm:size-3.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  )
}

const LANDING_INSIGHTS_LIMIT = 6

export function LandingInsightsSection() {
  const remoteItems = useInsightsShowcaseMerged()
  const filterLabels = useFilterLabelMap()
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
      className={cn('scroll-mt-24', landingBandClass, landingSectionYClass, landingPageGutterClass)}
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
            {slice.map((item) => {
              const cat = primaryCategory(item, filterLabels)
              return (
                <LandingInsightCard
                  key={item.id}
                  item={item}
                  categoryPill={cat.pill}
                  categoryMeta={cat.meta}
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


