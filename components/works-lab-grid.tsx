import { WorksLabCard, worksLabPrimaryTag, type WorksLabCardProps } from '@/components/works-lab-card'
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

function chunkPairs<T>(items: readonly T[]): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

type WorksLabRowProps = {
  items: readonly WorksLabGridItem[]
  /** Priority image for LCP (first card in first row). */
  lcpPriority?: boolean
}

export function WorksLabRow({ items, lcpPriority = false }: WorksLabRowProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 md:pb-16 lg:gap-10 2xl:gap-12 2xl:pb-20 3xl:pb-24">
      {items.map((item, i) => (
        <WorksLabCard
          key={item.id}
          title={item.title}
          tag={item.tag}
          desc={item.desc}
          year={item.year}
          href={item.href}
          imgSrc={item.imgSrc}
          heroMedia={item.heroMedia}
          priority={lcpPriority && i === 0}
          className={i === 1 ? 'md:translate-y-16' : undefined}
        />
      ))}
    </div>
  )
}

type WorksLabShowcaseGridProps = {
  items: readonly WorksLabGridItem[]
  lcpPriority?: boolean
  className?: string
}

/** Landing-style work grid: rows of two cards, second card staggered on md+. */
export function WorksLabShowcaseGrid({ items, lcpPriority = false, className }: WorksLabShowcaseGridProps) {
  const rows = chunkPairs(items)

  return (
    <div className={cn('flex min-w-0 flex-col gap-6 md:gap-8 lg:gap-10 2xl:gap-12', className)}>
      {rows.map((row, rowIndex) => (
        <WorksLabRow key={row.map((item) => item.id).join('-')} items={row} lcpPriority={lcpPriority && rowIndex === 0} />
      ))}
    </div>
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
