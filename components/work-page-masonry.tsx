import { WorkCard } from '@/components/work-card'
import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { cn } from '@/lib/utils'

function toCardProps(w: ShowcaseWork) {
  const { filterIds: _f, id: _id, slug: _slug, ...card } = w
  return card
}

export function WorkPageMasonry({
  works,
  lcpPriority,
}: {
  works: ShowcaseWork[]
  lcpPriority: boolean
}) {
  const left = works.filter((_, i) => i % 2 === 0)
  const right = works.filter((_, i) => i % 2 === 1)
  const firstId = works[0]?.id

  return (
    <>
      <div className="flex flex-col gap-10 sm:gap-12 lg:hidden">
        {works.map((w, i) => (
          <WorkCard
            key={w.id}
            {...toCardProps(w)}
            href={`/work/${w.slug}`}
            visualVariant="showcase"
            priority={lcpPriority && i === 0}
          />
        ))}
      </div>

      <div
        className={cn(
          'hidden items-start gap-x-10 md:gap-x-12 lg:flex',
          'lg:gap-x-14 xl:gap-x-16 2xl:gap-x-20',
        )}
      >
        <div className={cn('flex min-w-0 flex-1 flex-col', 'gap-12 xl:gap-16 2xl:gap-20')}>
          {left.map((w, i) => (
            <WorkCard
              key={w.id}
              {...toCardProps(w)}
              href={`/work/${w.slug}`}
              visualVariant="showcase"
              priority={lcpPriority && i === 0 && w.id === firstId}
            />
          ))}
        </div>
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col',
            'gap-12 pt-12 xl:gap-16 xl:pt-16 2xl:gap-20 2xl:pt-20',
          )}
        >
          {right.map((w) => (
            <WorkCard key={w.id} {...toCardProps(w)} href={`/work/${w.slug}`} visualVariant="showcase" />
          ))}
        </div>
      </div>
    </>
  )
}
