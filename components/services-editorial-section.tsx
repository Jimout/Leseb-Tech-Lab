import {
  landingPageContentMaxClass,
  landingPageGutterClass,
  landingSectionYClass,
} from '@/lib/landing-page-layout'
import { SERVICE_CATEGORIES } from '@/lib/services-pillars'
import { cn } from '@/lib/utils'

function ServiceCategoryBlock({
  categoryTitle,
  description,
  offerings,
  title,
}: {
  categoryTitle: string
  description: string
  offerings: { n: string; label: string }[]
  title: string
}) {
  return (
    <article
      className={cn(
        'border-t border-border py-14 md:py-20 lg:py-24',
        'first:border-t-0 first:pt-0',
      )}
      aria-label={title}
    >
      <h2
        className={cn(
          'font-display font-medium leading-[0.95] tracking-[-0.04em] text-foreground',
          'text-[clamp(3.25rem,11vw,7.5rem)]',
        )}
      >
        {categoryTitle}
      </h2>

      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-10 lg:mt-20 lg:gap-16">
        <p className="max-w-md text-pretty text-base leading-relaxed text-foreground/80 md:text-lg md:leading-relaxed lg:max-w-lg lg:text-xl">
          {description}
        </p>

        <ol className="border-t border-border">
          {offerings.map((item) => (
            <li
              key={item.n}
              className="flex items-baseline gap-5 border-b border-border py-5 md:gap-8 md:py-6"
            >
              <span className="w-7 shrink-0 font-mono text-sm tabular-nums text-muted-foreground md:text-base">
                {item.n}
              </span>
              <span className="text-base font-medium text-foreground md:text-lg lg:text-xl">{item.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  )
}

export function ServicesEditorialSection() {
  return (
    <section
      id="practices"
      className={cn('bg-background', landingPageGutterClass)}
      aria-labelledby="services-practices-heading"
    >
      <div
        className={cn(
          'mx-auto min-w-0',
          landingSectionYClass,
          landingPageContentMaxClass,
        )}
      >
        <h2 id="services-practices-heading" className="sr-only">
          Leseb services by practice
        </h2>

        {SERVICE_CATEGORIES.map((category) => (
          <ServiceCategoryBlock
            key={category.id}
            categoryTitle={category.categoryTitle}
            description={category.description}
            offerings={category.offerings}
            title={category.title}
          />
        ))}
      </div>
    </section>
  )
}

