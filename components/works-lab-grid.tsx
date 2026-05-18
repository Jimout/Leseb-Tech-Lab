import { WorksLabCard, worksLabPrimaryTag, type WorksLabCardProps } from '@/components/works-lab-card'
import { workLabCardGridClass, workLabCardLandingGridClass } from '@/lib/landing-page-typography'
import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { cn } from '@/lib/utils'

export type WorksLabGridItem = WorksLabCardProps & { id: string }

function workLabCardDesc(work: ShowcaseWork): string {
  const summary = work.cardSummary?.trim()
  if (summary) return summary
  const tag = worksLabPrimaryTag(work.category)
  return tag ? `${tag} at ${SITE_BRAND_FULL_NAME}.` : `Product and research at ${SITE_BRAND_FULL_NAME}.`
}

export function showcaseWorkToLabItem(work: ShowcaseWork): WorksLabGridItem {
  return {
    id: work.id,
    title: work.title,
    tag: worksLabPrimaryTag(work.category),
    desc: workLabCardDesc(work),
    year: work.year,
    href: `/work/${work.slug}`,
    heroMedia: work.heroMedia,
  }
}

type WorksLabShowcaseGridProps = {
  items: readonly WorksLabGridItem[]
  /** Priority image for LCP (first card). */
  lcpPriority?: boolean
  /** `landing` = one row of three on large screens; `catalog` = work index grid. */
  layout?: 'landing' | 'catalog'
  className?: string
}

const workLabGridByLayout = {
  landing: workLabCardLandingGridClass,
  catalog: workLabCardGridClass,
} as const

/** Responsive project grid — uniform columns, no staggered rows. */
export function WorksLabShowcaseGrid({
  items,
  lcpPriority = false,
  layout = 'catalog',
  className,
}: WorksLabShowcaseGridProps) {
  return (
    <ul className={cn(workLabGridByLayout[layout], className)} aria-label="Projects">
      {items.map((item, index) => (
        <li key={item.id} className="min-w-0">
          <WorksLabCard
            title={item.title}
            tag={item.tag}
            desc={item.desc}
            year={item.year}
            href={item.href}
            imgSrc={item.imgSrc}
            heroMedia={item.heroMedia}
            priority={lcpPriority && index === 0}
            layout={layout}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  )
}

type WorksLabShowcaseFromWorksProps = {
  works: readonly ShowcaseWork[]
  lcpPriority?: boolean
  /** Match landing “In the Lab” card sizing and aspect ratio. */
  layout?: 'landing' | 'catalog'
  className?: string
}

export function WorksLabShowcaseFromWorks({
  works,
  lcpPriority,
  layout = 'catalog',
  className,
}: WorksLabShowcaseFromWorksProps) {
  const items = works.map(showcaseWorkToLabItem)
  return (
    <WorksLabShowcaseGrid items={items} lcpPriority={lcpPriority} layout={layout} className={className} />
  )
}
