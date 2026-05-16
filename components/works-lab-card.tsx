import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { MediaRenderer } from '@/components/media-renderer'
import type { MediaAsset } from '@/lib/media-assets'
import {
  landingEmptyCoverClass,
  landingPanelEaseClass,
  workLabCardBodyClass,
  workLabCardCtaClass,
  workLabCardFooterClass,
  workLabCardHeaderClass,
  workLabCardLandingBodyClass,
  workLabCardLandingMediaClass,
  workLabCardLocationClass,
  workLabCardMediaClass,
  workLabCardShellClass,
  workLabCardTagClass,
  workLabCardTitleClass,
  workLabCardYearClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export type WorksLabCardProps = {
  title: string
  tag: string
  desc: string
  year: string
  href: string
  imgSrc?: string
  heroMedia?: MediaAsset | null
  priority?: boolean
  layout?: 'landing' | 'catalog'
  className?: string
}

const workLabCardMediaImageClass = cn(
  'absolute inset-0 size-full object-cover object-center',
  'transition-transform duration-500 motion-reduce:transition-none',
  'group-hover:scale-[1.03] motion-reduce:group-hover:scale-100',
  landingPanelEaseClass,
)

export function WorksLabCard({
  title,
  tag,
  desc,
  year,
  href,
  imgSrc,
  heroMedia,
  priority = false,
  layout = 'catalog',
  className,
}: WorksLabCardProps) {
  const hasMedia = Boolean(heroMedia?.url?.trim() || imgSrc?.trim())
  const location = desc.trim()
  const yearLabel = year.trim()
  const isLanding = layout === 'landing'
  const mediaClass = isLanding ? workLabCardLandingMediaClass : workLabCardMediaClass
  const bodyClass = isLanding ? workLabCardLandingBodyClass : workLabCardBodyClass
  const imageSizes = isLanding
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : '(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 22rem'

  return (
    <Link
      href={href}
      className={cn(workLabCardShellClass, className)}
      aria-label={location ? `${title}, ${location}` : title}
    >
      <div className={mediaClass}>
        {!hasMedia ? (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className={landingEmptyCoverClass}>No cover</span>
          </div>
        ) : heroMedia?.url?.trim() ? (
          <MediaRenderer
            media={heroMedia}
            className={workLabCardMediaImageClass}
            sizes={imageSizes}
            controls={false}
            autoplay={false}
          />
        ) : (
          <Image
            src={imgSrc!}
            alt=""
            fill
            sizes={imageSizes}
            priority={priority}
            className={workLabCardMediaImageClass}
          />
        )}
      </div>

      <div className={bodyClass}>
        <div className={workLabCardHeaderClass}>
          <p className={workLabCardTagClass}>{tag}</p>
          {yearLabel ? <p className={workLabCardYearClass}>{yearLabel}</p> : null}
        </div>

        <h3 className={workLabCardTitleClass} title={title}>
          {title}
        </h3>

        <div className={workLabCardFooterClass}>
          {location ? (
            <p className={workLabCardLocationClass} title={location}>
              {location}
            </p>
          ) : (
            <span className="min-w-0 flex-1" aria-hidden />
          )}
          <span className={workLabCardCtaClass}>
            View
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

export function worksLabPrimaryTag(category: string): string {
  const first = category
    .split(',')
    .map((s) => s.trim())
    .find(Boolean)
  return first ?? category
}
