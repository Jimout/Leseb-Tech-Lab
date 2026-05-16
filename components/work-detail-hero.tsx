import { containerMaxWidthClass, containerPaddingClass } from '@/components/layout/container'
import { WorkDetailFillImage } from '@/components/work-detail-fill-image'
import { TagPill } from '@/components/tag-pill'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { workDetailHeroTitleClass } from '@/lib/work-detail-typography'
import { cn } from '@/lib/utils'

export type WorkDetailHeroProps = {
  work: ShowcaseWork
  pageTitle: string
  pageTitleLines?: readonly [string, string]
  year: string
  location: string
  tags: string[]
}

const imageSizes =
  '(max-width: 1024px) 100vw, (max-width: 1536px) calc(100vw - 7rem), min(90vw, 1600px)'

function WorkHeroHeading({
  pageTitle,
  pageTitleLines,
}: {
  pageTitle: string
  pageTitleLines?: readonly [string, string]
}) {
  if (pageTitleLines) {
    return (
      <h1 className={workDetailHeroTitleClass}>
        <span className="block">{pageTitleLines[0]}</span>
        <span className="mt-1 block sm:mt-1.5">{pageTitleLines[1]}</span>
      </h1>
    )
  }
  return <h1 className={workDetailHeroTitleClass}>{pageTitle}</h1>
}

export function WorkDetailHero({
  work,
  pageTitle,
  pageTitleLines,
  year,
  location,
  tags,
}: WorkDetailHeroProps) {
  const hasHero = Boolean(work.heroMedia?.url?.trim())

  return (
    <header className="w-full">
      <div className={cn('mx-auto', containerMaxWidthClass, containerPaddingClass)}>
        {tags.length > 0 ? (
          <div className="mb-5 flex flex-wrap gap-2 sm:mb-6 sm:gap-2.5">
            {tags.map((tag) => (
              <TagPill key={tag} variant="accent">
                {tag}
              </TagPill>
            ))}
          </div>
        ) : null}

        <WorkHeroHeading pageTitle={pageTitle} pageTitleLines={pageTitleLines} />

        <p className="mt-4 text-sm text-muted-foreground sm:mt-5 sm:text-base">
          {year}
          <span className="mx-2 text-signal" aria-hidden>
            ·
          </span>
          {location}
        </p>

        <div
          className={cn(
            'relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-image-well',
            'sm:mt-10 sm:rounded-3xl lg:mt-12',
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
            <div className="flex size-full min-h-[14rem] items-center justify-center text-sm text-muted-foreground">
              No hero media
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
