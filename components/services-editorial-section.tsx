import {
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import {
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleClass,
  servicesOfferingIndexClass,
  servicesOfferingLabelClass,
  servicesPracticeDescriptionClass,
} from '@/lib/landing-page-typography'
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
        'border-t border-border py-8 md:py-12 lg:py-14',
        'first:border-t-0 first:pt-0',
      )}
      aria-label={title}
    >
      <div className={cn('mb-4', landingSectionKickerClass)}>
        <span className={landingSectionKickerDotClass} aria-hidden />
        {title}
      </div>
      <h2 className={landingSectionTitleClass}>{categoryTitle}</h2>

      <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-2 md:gap-8 lg:mt-12 lg:gap-12">
        <p className={servicesPracticeDescriptionClass}>{description}</p>

        <ol className="border-t border-border">
          {offerings.map((item) => (
            <li
              key={item.n}
              className="flex items-baseline gap-5 border-b border-border py-5 md:gap-8 md:py-6"
            >
              <span className={servicesOfferingIndexClass}>{item.n}</span>
              <span className={servicesOfferingLabelClass}>{item.label}</span>
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
          'pt-8 pb-8 md:pt-10 md:pb-10 lg:pt-12 lg:pb-12 xl:pt-14 xl:pb-14 2xl:pt-16 2xl:pb-16',
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

