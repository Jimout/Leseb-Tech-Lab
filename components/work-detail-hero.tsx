import { containerMaxWidthClass, containerPaddingClass } from '@/components/layout/container'
import { WorkDetailFillImage } from '@/components/work-detail-fill-image'
import { TagPill } from '@/components/tag-pill'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { cn } from '@/lib/utils'

type WorkDetailHeroProps = {
  work: ShowcaseWork
  pageTitle: string
  pageTitleLines?: readonly [string, string]
  year: string
  location: string
  tags: string[]
}

const titleCardRadius = 'rounded-bl-[var(--hero-corner)]'

const imageSizes =
  '(max-width: 1024px) calc(100vw - 4rem), (max-width: 1536px) calc(100vw - 7rem), min(90vw, 1600px)'

/** Subtle radius on full-bleed work photos; container clips `fill` images. */
export const workDetailPhotoRadiusClass =
  'rounded-tl-lg sm:rounded-tl-xl rounded-tr-lg sm:rounded-tr-xl rounded-b-3xl sm:rounded-b-[2.25rem] xl:rounded-b-[2.5rem]'

/** Shared with `WorkDetailContent` secondary hero block — same min-height scale as the main hero image. */
export const workDetailMainImageHeightClass = cn(
  'relative w-full overflow-hidden',
  workDetailPhotoRadiusClass,
  'min-h-[min(100vh,1120px)] sm:min-h-[min(100vh,1320px)] md:min-h-[min(100vh,1580px)]',
  'lg:min-h-[min(100vh,1900px)] xl:min-h-[min(120vh,2300px)] 2xl:min-h-[min(130vh,2700px)] 3xl:min-h-[min(140vh,3200px)]',
)

/** Same scale as `InsightDetailHeroTitle` in `insight-detail-hero` (desktop panel + mobile card). */
const heroTitleHeadingClass = cn(
  'mt-2 font-bold leading-[1.02] tracking-tight text-foreground sm:mt-2.5',
  'text-[2rem] sm:text-[2.45rem]',
  'lg:text-[3.9vw] xl:text-[3.45vw] 2xl:text-[3.0rem] 3xl:text-[3.35rem]',
)

function WorkHeroHeading({
  pageTitle,
  pageTitleLines,
}: {
  pageTitle: string
  pageTitleLines?: readonly [string, string]
}) {
  if (pageTitleLines) {
    return (
      <h1 className={heroTitleHeadingClass}>
        <span className="block whitespace-normal">{pageTitleLines[0]}</span>
        <span className="mt-0.5 block whitespace-normal sm:mt-1">{pageTitleLines[1]}</span>
      </h1>
    )
  }
  return <h1 className={cn(heroTitleHeadingClass, 'text-balance')}>{pageTitle}</h1>
}

function TitleBlock({
  year,
  location,
  pageTitle,
  pageTitleLines,
  className,
}: {
  year: string
  location: string
  pageTitle: string
  pageTitleLines?: readonly [string, string]
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-[15px] text-foreground/85 sm:text-base lg:text-lg xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-2xl">
        {year}
        <span className="mx-2 text-accent" aria-hidden>
          •
        </span>
        {location}
      </p>
      <WorkHeroHeading pageTitle={pageTitle} pageTitleLines={pageTitleLines} />
    </div>
  )
}

function TagsRow({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full max-w-none flex-wrap gap-2 sm:gap-2.5 lg:gap-3 2xl:gap-3.5',
        className,
      )}
    >
      {tags.map((tag) => (
        <TagPill key={tag} variant="accent">
          {tag}
        </TagPill>
      ))}
    </div>
  )
}

function CornerConnector({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={cn('h-(--hero-corner) w-(--hero-corner) fill-current', className)}
    >
      <path d="M98.1 0h1.9v51.9h-1.9c0-27.6-22.4-50-50-50V0h50z" />
    </svg>
  )
}

function HeroTitleCard(props: Pick<WorkDetailHeroProps, 'year' | 'location' | 'pageTitle' | 'pageTitleLines'>) {
  return (
    <section
      className={cn(
        'relative z-20 w-full lg:ms-auto lg:w-[62.5%]',
        'lg:-mb-24 xl:-mb-28 2xl:-mb-32',
      )}
    >
      <div
        className={cn(
          'relative block w-full min-w-0 bg-page-grid',
          titleCardRadius,
          'px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6 lg:px-10 lg:pb-5 lg:pt-0',
        )}
        style={{ ['--hero-corner' as string]: 'clamp(1.6rem, 2.8vw, 3rem)' }}
      >
        <CornerConnector className="text-background absolute bottom-0 left-0 z-30 mb-px ml-px -translate-x-full" />
        <CornerConnector className="text-background absolute bottom-0 right-0 z-30 mb-px -mr-px translate-y-full" />
        <TitleBlock
          year={props.year}
          location={props.location}
          pageTitle={props.pageTitle}
          pageTitleLines={props.pageTitleLines}
        />
      </div>
    </section>
  )
}

function HeroMainImage({ work }: Pick<WorkDetailHeroProps, 'work'>) {
  const hasHero = Boolean(work.heroMedia?.url?.trim())
  return (
    <div
      className={cn(
        workDetailMainImageHeightClass,
        'z-10 aspect-4/3 min-h-0 lg:aspect-video',
        'lg:-mt-8 xl:-mt-10 2xl:-mt-12',
      )}
    >
      {hasHero ? (
        <WorkDetailFillImage
          src={work.heroMedia?.url ?? ''}
          alt={work.heroMedia?.alt ?? ''}
          priority
          sizes={imageSizes}
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-muted/35 text-sm text-muted-foreground">
          No hero media
        </div>
      )}
    </div>
  )
}

export function WorkDetailHero(props: WorkDetailHeroProps) {
  return (
    <header className="relative w-full overflow-x-hidden">
      <div className={cn('mx-auto', containerMaxWidthClass, containerPaddingClass)}>
        <div className="relative w-full px-2 lg:px-3 xl:px-4">
          <div
            className={cn(
              'relative z-20 mb-5 flex w-full flex-wrap items-start justify-between lg:mb-10',
            )}
          >
            <TagsRow
              tags={props.tags}
              className="hidden w-full lg:flex lg:w-[37.5%]"
            />
            <HeroTitleCard
              year={props.year}
              location={props.location}
              pageTitle={props.pageTitle}
              pageTitleLines={props.pageTitleLines}
            />
          </div>
          <div className="absolute -right-px top-0 z-20 rounded-bl-3xl bg-page-grid pl-3 pb-3 pr-2 lg:hidden">
            <CornerConnector className="text-background absolute -top-px left-px -translate-x-full" />
            <CornerConnector className="text-background absolute bottom-px right-0 translate-y-full" />
            <TagsRow tags={props.tags} className="max-w-64 -mb-2 -mr-1.5" />
          </div>
          <HeroMainImage work={props.work} />
        </div>
      </div>
    </header>
  )
}
