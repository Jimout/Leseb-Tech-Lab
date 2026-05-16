import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { MediaRenderer } from '@/components/media-renderer'
import type { MediaAsset } from '@/lib/media-assets'
import {
  landingCardDescClass,
  landingCardTagClass,
  landingCardTitleClass,
  landingEmptyCoverClass,
  landingMediaMetaClass,
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
  className?: string
}

export function WorksLabCard({
  title,
  tag,
  desc,
  year,
  href,
  imgSrc,
  heroMedia,
  priority = false,
  className,
}: WorksLabCardProps) {
  const hasMedia = Boolean(heroMedia?.url?.trim() || imgSrc?.trim())

  return (
    <Link
      href={href}
      className={cn(
        'group relative block overflow-hidden rounded-3xl bg-box aspect-2/1 md:aspect-video',
        className,
      )}
    >
      {hasMedia ? (
        heroMedia?.url?.trim() ? (
          <MediaRenderer
            media={heroMedia}
            className="absolute inset-0 size-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
            sizes="(min-width: 768px) 50vw, 100vw"
            controls={false}
            autoplay={false}
          />
        ) : (
          <Image
            src={imgSrc!}
            alt={title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={priority}
            className="object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-box" aria-hidden>
          <span className={landingEmptyCoverClass}>No cover</span>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/25 to-transparent" />

      <div className={cn('absolute top-6 right-6 left-6 flex items-center justify-between', landingMediaMetaClass)}>
        <span className={landingCardTagClass}>
          {tag}
        </span>
        <span>{year}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
        <h3 className={landingCardTitleClass}>
          {title}
          <ArrowUpRight className="size-6 text-signal transition-transform group-hover:rotate-45" />
        </h3>
        <p className={landingCardDescClass}>{desc}</p>
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


