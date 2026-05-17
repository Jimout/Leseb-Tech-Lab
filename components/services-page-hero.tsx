import {
  catalogPageBelowNavPadTopClass,
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import {
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleAccentClass,
  landingSectionTitleClass,
  servicesHeroIntroClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export function ServicesPageHero() {
  return (
    <section
      data-nav-surface="dark"
      aria-labelledby="services-hero-heading"
      className={cn(
        'relative overflow-hidden bg-background',
        catalogPageBelowNavPadTopClass,
        'pb-12 md:pb-16 lg:pb-20',
        landingPageGutterClass,
      )}
    >
      <div className={cn('relative mx-auto min-w-0', landingPageContentMaxClass)}>
          <div className={cn('mb-4', landingSectionKickerClass)}>
            <span className={landingSectionKickerDotClass} aria-hidden />
            Services
          </div>

          <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8 lg:gap-12">
            <h1 id="services-hero-heading" className={cn('md:col-span-7', landingSectionTitleClass)}>
              We&apos;re a human centered
              <br />
              tech lab with
              <br />
              <span className={landingSectionTitleAccentClass}>deep expertise.</span>
            </h1>

            <p className={cn('md:col-span-5 md:col-start-8 md:justify-self-end', servicesHeroIntroClass)}>
              We bring careful engineering and local context to teams building AI, software, and data products, so
              what you launch respects the people who depend on it.
            </p>
          </div>
      </div>
    </section>
  )
}
