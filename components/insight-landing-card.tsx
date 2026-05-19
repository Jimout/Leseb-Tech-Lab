'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { MediaRenderer } from '@/components/media-renderer'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import {
  landingEmptyCoverClass,
  landingPanelEaseClass,
  workLabCardCtaClass,
  workLabCardFooterClass,
  workLabCardHeaderClass,
  workLabCardLandingBodyClass,
  workLabCardLandingMediaClass,
  workLabCardLocationClass,
  workLabCardShellClass,
  workLabCardTagClass,
  workLabCardTitleClass,
  workLabCardYearClass,
  landingInsightCardWidthClass,
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

const insightCardMediaImageClass = cn(
  'absolute inset-0 size-full object-cover object-center',
  'transition-transform duration-500 motion-reduce:transition-none',
  'group-hover:scale-[1.03] motion-reduce:group-hover:scale-100',
  landingPanelEaseClass,
)

export type InsightLandingCardProps = {
  item: ShowcaseInsight
  categoryPill: string
  categoryMeta: string
  className?: string
  imageSizes?: string
}

/** Insight card — same shell, media ratio, and body layout as landing work lab cards. */
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
      className={cn(workLabCardShellClass, className)}
      aria-label={summary ? `${item.title}, ${summary}` : item.title}
    >
      <div className={workLabCardLandingMediaClass}>
        {!hasCover ? (
          <div className="absolute inset-0 flex items-center justify-center bg-catalog-card-media" aria-hidden>
            <span className={landingEmptyCoverClass}>No cover</span>
          </div>
        ) : (
          <MediaRenderer
            media={item.heroMedia!}
            className={insightCardMediaImageClass}
            sizes={imageSizes}
            controls={false}
            autoplay={false}
          />
        )}
      </div>

      <div className={workLabCardLandingBodyClass}>
        <div className={workLabCardHeaderClass}>
          <p className={workLabCardTagClass}>{categoryPill}</p>
          {item.date ? (
            item.dateIso ? (
              <time dateTime={item.dateIso} className={workLabCardYearClass}>
                {item.date}
              </time>
            ) : (
              <p className={workLabCardYearClass}>{item.date}</p>
            )
          ) : null}
        </div>

        <h3 className={workLabCardTitleClass} title={item.title}>
          {item.title}
        </h3>

        <div className={workLabCardFooterClass}>
          {summary ? (
            <p className={workLabCardLocationClass} title={summary}>
              {summary}
            </p>
          ) : (
            <span className="min-w-0 flex-1" aria-hidden />
          )}
          <span className={workLabCardCtaClass}>
            Read
            <ArrowUpRight
              strokeWidth={2}
              className="size-2.5 text-signal transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Strip width matches one column of the work lab landing grid at each breakpoint. */
export const insightLandingCardStripWidthClass = landingInsightCardWidthClass
