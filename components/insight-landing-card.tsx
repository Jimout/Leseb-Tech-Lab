'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { MediaRenderer } from '@/components/media-renderer'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import {
  landingEmptyCoverClass,
  landingInsightCardClass,
  landingInsightCardCtaClass,
  landingInsightCardFooterClass,
  landingInsightCardMediaDescClass,
  landingInsightCardMediaTitleClass,
  landingInsightCardPillClass,
  landingInsightCardWidthClass,
  landingPanelEaseClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export function useInsightFilterLabelMap(): Map<string, string> {
  const { settings } = useSiteSettings()
  return React.useMemo(() => {
    const m = new Map<string, string>()
    for (const e of settings.portfolioCatalogFilters?.workInsights ?? []) {
      if (e.id !== 'all') m.set(e.id, e.label)
    }
    return m
  }, [settings.portfolioCatalogFilters.workInsights])
}

export function primaryInsightCategory(
  item: ShowcaseInsight,
  labels: Map<string, string>,
): { pill: string; meta: string } {
  for (const id of item.filterIds ?? []) {
    const l = labels.get(id)
    if (l) return { pill: l.toUpperCase(), meta: l }
  }
  return { pill: 'INSIGHT', meta: 'Insights' }
}

export type InsightLandingCardProps = {
  item: ShowcaseInsight
  categoryPill: string
  categoryMeta: string
  className?: string
  imageSizes?: string
}

/** Insight card — overlay title on media + footer bar (distinct from work lab cards). */
export function InsightLandingCard({
  item,
  categoryPill,
  categoryMeta,
  className,
  imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: InsightLandingCardProps) {
  const hasCover = Boolean(item.heroMedia?.url?.trim())
  const summary = item.description?.trim() || categoryMeta

  return (
    <Link
      href={item.href}
      draggable={false}
      className={cn(landingInsightCardClass, className)}
      aria-label={summary ? `${item.title}, ${summary}` : item.title}
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
            sizes={imageSizes}
            controls={false}
            autoplay={false}
          />
        )}
        <span className={landingInsightCardPillClass}>{categoryPill}</span>
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-linear-to-t from-background/88 via-background/45 to-transparent px-3.5 pb-3.5 pt-16 sm:px-4 sm:pb-4 sm:pt-20">
          <h3 className={landingInsightCardMediaTitleClass}>{item.title}</h3>
          {item.description?.trim() ? (
            <p className={landingInsightCardMediaDescClass}>{item.description}</p>
          ) : null}
        </div>
      </div>

      <div className={landingInsightCardFooterClass}>
        <div className="relative min-w-0">
          {item.date ? (
            item.dateIso ? (
              <time
                dateTime={item.dateIso}
                className="text-[11px] font-semibold text-foreground transition-colors duration-500 group-hover:text-signal sm:text-xs"
              >
                {item.date}
              </time>
            ) : (
              <p className="text-[11px] font-semibold text-foreground transition-colors duration-500 group-hover:text-signal sm:text-xs">
                {item.date}
              </p>
            )
          ) : null}
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

/** Strip width matches one column of the work lab landing grid at each breakpoint. */
export const insightLandingCardStripWidthClass = landingInsightCardWidthClass
