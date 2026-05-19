'use client'

import Link from 'next/link'

import { MediaRenderer } from '@/components/media-renderer'
import { useInsightFilterLabelMap } from '@/components/insight-landing-card'
import type { InsightDetail } from '@/lib/insight-detail-types'
import {
  insightDetailHeroDescriptionClass,
  insightDetailHeroImageClass,
  insightDetailHeroTitleClass,
  insightDetailSansClass,
} from '@/lib/insight-detail-typography'
import {
  catalogPageBelowNavPadTopClass,
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import {
  detailHeroTopicPillOnImageClass,
  landingEmptyCoverClass,
  landingMetaClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import type { MediaAsset } from '@/lib/media-assets'
import { cn } from '@/lib/utils'

export type InsightDetailHeroProps = Pick<
  InsightDetail,
  'title' | 'date' | 'dateIso' | 'description' | 'heroMedia' | 'filterIds'
>

function HeroImageTagOverlay({
  filterIds,
  labels,
}: {
  filterIds: readonly string[]
  labels: Map<string, string>
}) {
  const pills = filterIds
    .map((id) => labels.get(id))
    .filter((label): label is string => Boolean(label))

  if (!pills.length) return null

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col justify-end',
        'opacity-0 transition-opacity duration-300 motion-reduce:transition-none',
        'group-hover:opacity-100 group-focus-within:opacity-100',
        'max-md:opacity-100',
      )}
    >
      <div
        className={cn(
          'absolute inset-0',
          'bg-linear-to-t from-neutral-900/85 via-neutral-700/45 to-transparent',
        )}
      />
      <ul className="relative flex flex-wrap gap-2 p-4 sm:p-5" aria-label="Topics">
        {pills.map((label) => (
          <li key={label}>
            <span className={cn(detailHeroTopicPillOnImageClass, 'pointer-events-none')}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HeroCover({ media, className }: { media: MediaAsset; className?: string }) {
  return (
    <MediaRenderer
      media={media}
      className={cn('absolute inset-0 size-full object-cover object-center', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1400px"
      controls={false}
      autoplay={false}
    />
  )
}

export function InsightDetailHero({
  title,
  date,
  dateIso,
  description,
  heroMedia,
  filterIds,
}: InsightDetailHeroProps) {
  const filterLabels = useInsightFilterLabelMap()
  const hasCover = Boolean(heroMedia?.url?.trim())
  const dek = (description ?? '').trim()
  const topicIds = filterIds ?? []

  return (
    <header
      data-nav-surface="dark"
      className={cn(
        'relative overflow-hidden bg-background',
        catalogPageBelowNavPadTopClass,
        'pb-8 sm:pb-10 md:pb-12',
      )}
    >
      <div
        className={cn(
          'relative mx-auto min-w-0',
          landingPageGutterClass,
          landingPageContentMaxClass,
        )}
      >
        <div>
          <Link
            href="/insights"
            className={cn(landingSectionKickerClass, 'w-fit transition-opacity hover:opacity-80')}
          >
            <span className={landingSectionKickerDotClass} aria-hidden />
            Insight blog
          </Link>
        </div>

        <div className="mt-6 md:mt-8 lg:mt-10">
          {dateIso ? (
            <time dateTime={dateIso} className={cn(landingMetaClass, insightDetailSansClass)}>
              {date}
            </time>
          ) : (
            <p className={cn(landingMetaClass, insightDetailSansClass)}>{date}</p>
          )}
          <div
            className={cn(
              'mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mt-4 md:gap-x-8 lg:gap-x-10',
              !dek && 'flex-col',
            )}
          >
            <h1 className={cn(insightDetailHeroTitleClass, 'min-w-0 md:flex-1')}>{title}</h1>
            {dek ? (
              <p
                className={cn(
                  insightDetailHeroDescriptionClass,
                  'max-w-xl shrink-0 md:max-w-md md:text-right lg:max-w-lg',
                )}
              >
                {dek}
              </p>
            ) : null}
          </div>
        </div>

        <div
          tabIndex={topicIds.length > 0 ? 0 : undefined}
          className={insightDetailHeroImageClass}
        >
          {hasCover ? (
            <HeroCover media={heroMedia!} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <span className={landingEmptyCoverClass}>No cover</span>
            </div>
          )}
          <HeroImageTagOverlay filterIds={topicIds} labels={filterLabels} />
        </div>
      </div>
    </header>
  )
}
