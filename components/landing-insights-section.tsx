'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { MediaRenderer } from '@/components/media-renderer'
import { useDragScrollX } from '@/hooks/use-drag-scroll-x'
import { useInsightsShowcaseMerged } from '@/hooks/use-insights-showcase-merged'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { useHorizontalStripWheelCallback } from '@/hooks/use-horizontal-strip-wheel'
import { SHOWCASE_INSIGHTS, type ShowcaseInsight } from '@/lib/insights-showcase-data'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

const PANEL_EASE = 'ease-[cubic-bezier(0.65,0,0.35,1)]'
const STRIP_GAP = 'gap-5 sm:gap-6 md:gap-7'

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

const stripClass = cn(
  'flex min-w-0 w-full overflow-x-auto pb-2',
  STRIP_GAP,
  'snap-x snap-proximity',
  /** Avoid scroll anchoring shifting scrollLeft while the page moves vertically */
  '[overflow-anchor:none]',
  'overscroll-x-contain [touch-action:pan-x_pan-y]',
  'select-none cursor-grab active:cursor-grabbing',
  '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
)

const cardWidthClass = cn(
  'w-[min(90vw,22rem)] shrink-0 snap-start sm:w-[min(88vw,24rem)]',
  'md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2rem)/2.2)] xl:w-[calc((100%-2.5rem)/2.4)]',
)

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
      className={cn(
        cardWidthClass,
        'group relative flex max-w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/12 bg-white/4 text-left outline-none backdrop-blur-[2px]',
        'transition-shadow duration-500 hover:border-white/18 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.85)]',
        'focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
      )}
    >
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-zinc-900">
        {!hasCover ? (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900" aria-hidden>
            <span className="text-xs font-medium text-white/45">No cover</span>
          </div>
        ) : (
          <MediaRenderer
            media={item.heroMedia!}
            className={cn(
              'absolute inset-0 size-full object-cover object-center',
              'transition-transform duration-500 motion-reduce:transition-none',
              'group-hover:scale-[1.03] motion-reduce:group-hover:scale-100',
              PANEL_EASE,
            )}
            sizes="(max-width: 768px) 90vw, 400px"
            controls={false}
            autoplay={false}
          />
        )}
        <span className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:right-4 sm:top-4">
          {categoryPill}
        </span>
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 bg-linear-to-t from-black/88 via-black/45 to-transparent px-4 pb-4 pt-20 sm:px-5 sm:pb-5 sm:pt-24">
          <h3 className="font-display text-lg font-semibold leading-[1.15] tracking-tight text-white sm:text-xl">
            {item.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-white/88">{item.description}</p>
        </div>
      </div>

      <div className="relative flex min-h-21 items-center justify-between gap-3 border-t border-white/10 bg-black/35 px-4 py-3 transition-colors duration-500 group-hover:bg-white/[0.07] sm:min-h-22 sm:px-5 sm:py-4">
        <div className="relative min-w-0">
          <p className="text-xs font-semibold text-white transition-colors duration-500 group-hover:text-signal sm:text-sm">
            {item.date}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-white/60 transition-colors duration-500 group-hover:text-white/85 sm:text-xs">
            {categoryMeta}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-transparent px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-white transition-colors duration-500 sm:px-4',
            'group-hover:border-signal/50 group-hover:text-signal',
          )}
        >
          Read
          <ArrowUpRight
            strokeWidth={2}
            className="size-3.5 text-signal transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100"
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
  const stripWheelRef = useHorizontalStripWheelCallback<HTMLDivElement>()
  const dragScroll = useDragScrollX()
  const slice = React.useMemo(() => {
    const source = remoteItems.length > 0 ? remoteItems : SHOWCASE_INSIGHTS
    return source.slice(0, LANDING_INSIGHTS_LIMIT)
  }, [remoteItems])

  return (
    <section
      id="insights"
      data-nav-surface="dark"
      className={cn(
        'scroll-mt-24 border-t border-white/10 bg-black text-white',
        'py-16 md:py-24 lg:py-28 xl:py-32',
        landingPageGutterClass,
      )}
    >
      <div className={cn('mx-auto min-w-0', landingPageContentMaxClass)}>
        <div className="mb-10 flex flex-col gap-8 md:mb-12 md:flex-row md:items-end md:justify-between lg:mb-14">
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-signal">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
              Insights
            </div>
            <h2 className="font-display text-balance text-4xl leading-[0.95] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-white">Discover</span>
              <span className="block text-white">
                what&apos;s <span className="font-light italic text-signal">on.</span>
              </span>
            </h2>
          </div>
          <div className="shrink-0 md:pb-1">
            <FluidSplitButton label="View all insights" href="/insights" variant="secondary" size="navbar" />
          </div>
        </div>

        <div
          ref={stripWheelRef}
          role="region"
          aria-label="Featured insights"
          className={stripClass}
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
    </section>
  )
}
