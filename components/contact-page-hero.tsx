import type { ContactPageSettings } from '@/lib/admin/site-settings'
import {
  catalogPageBelowNavPadTopClass,
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import {
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { typeAccentItalic, typeContactHero } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

type ContactPageHeroProps = {
  contact: ContactPageSettings
}

export function ContactPageHero({ contact }: ContactPageHeroProps) {
  return (
    <section
      data-nav-surface="dark"
      aria-labelledby="contact-hero-heading"
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
          {contact.heroEyebrow}
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8 lg:gap-12">
          <h1
            id="contact-hero-heading"
            className={cn(typeContactHero, 'md:col-span-7')}
          >
            {contact.heroLine1}
            <br />
            {contact.heroLine2}
            <span className={typeAccentItalic}>{contact.heroAccent}</span>
          </h1>

          <p
            className={cn(
              'max-w-md text-pretty text-base leading-relaxed text-foreground/75',
              'md:col-span-5 md:col-start-8 md:justify-self-end md:text-right md:text-lg lg:max-w-sm lg:text-xl',
              '2xl:text-xl 3xl:text-2xl 4xl:text-2xl',
            )}
          >
            {contact.heroDescription}
          </p>
        </div>
      </div>
    </section>
  )
}
