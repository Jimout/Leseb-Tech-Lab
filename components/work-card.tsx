import Link from 'next/link'

import { WorkCardSurface } from '@/components/work-card-surface'
import type { WorkCardPaginationConfig } from '@/components/work-card-surface'
import type { MediaAsset } from '@/lib/media-assets'

export type { WorkCardPaginationConfig } from '@/components/work-card-surface'

import { sectionKickerAccentClass } from '@/lib/section-kicker-classes'
import { cn } from '@/lib/utils'

/** Showcase masonry: fill ~half the container (minus gutter), responsive with column */
const showcaseCardWidthClass = 'w-full min-w-0 max-w-full'

export type WorkCardProps = {
  heroMedia: MediaAsset | null
  year: string
  location: string
  title: string
  category: string
  className?: string
  href?: string
  priority?: boolean
  pagination?: WorkCardPaginationConfig
  visualVariant?: 'default' | 'showcase'
}

function WorkCardBody({
  year,
  location,
  title,
  category,
}: Pick<WorkCardProps, 'year' | 'location' | 'title' | 'category'>) {
  return (
    <div className="flex flex-col gap-3 pt-1.5 sm:gap-3.5">
      <p className="text-sm font-light leading-relaxed text-foreground">
        {year}
        <span className="mx-2 text-accent" aria-hidden>
          •
        </span>
        {location}
      </p>
      <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-[1.75rem] md:leading-tight 2xl:text-[2rem] 3xl:text-[2.25rem] 4xl:text-[2.5rem]">
        {title}
      </h3>
      <p className={cn('text-sm font-light sm:text-[15px]', sectionKickerAccentClass)}>{category}</p>
    </div>
  )
}

function WorkCardArticle(props: WorkCardProps) {
  const {
    heroMedia,
    year,
    location,
    title,
    category,
    className,
    priority,
    pagination,
    visualVariant,
  } = props
  return (
    <article
      className={cn(
        'flex min-h-0 flex-col',
        visualVariant === 'showcase' ? showcaseCardWidthClass : 'w-full max-w-full',
        className,
      )}
    >
      <WorkCardSurface
        heroMedia={heroMedia}
        category={category}
        priority={priority}
        pagination={pagination}
        visualVariant={visualVariant}
      >
        <WorkCardBody
          year={year}
          location={location}
          title={title}
          category={category}
        />
      </WorkCardSurface>
    </article>
  )
}

export function WorkCard(props: WorkCardProps) {
  const { href, className, visualVariant, ...rest } = props

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'block rounded-2xl outline-none transition-opacity hover:opacity-95',
          'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          visualVariant === 'showcase' && cn(showcaseCardWidthClass, 'min-w-0'),
          className,
        )}
      >
        <WorkCardArticle {...rest} visualVariant={visualVariant} className="w-full max-w-full" />
      </Link>
    )
  }

  return <WorkCardArticle {...props} />
}
