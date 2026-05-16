import { WorksLabCard, worksLabPrimaryTag, type WorksLabCardProps } from '@/components/works-lab-card'
import { workLabCardGridClass, workLabCardLandingGridClass } from '@/lib/landing-page-typography'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { cn } from '@/lib/utils'

export type WorksLabGridItem = WorksLabCardProps & { id: string }

export function showcaseWorkToLabItem(work: ShowcaseWork): WorksLabGridItem {
  return {
    id: work.id,
    title: work.title,
    tag: worksLabPrimaryTag(work.category),
    desc: work.location,
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
  className?: string
}

export function WorksLabShowcaseFromWorks({ works, lcpPriority, className }: WorksLabShowcaseFromWorksProps) {
  const items = works.map(showcaseWorkToLabItem)
  return <WorksLabShowcaseGrid items={items} lcpPriority={lcpPriority} className={className} />
}
