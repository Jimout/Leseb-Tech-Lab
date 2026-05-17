import type { ContactPageSettings } from '@/lib/admin/site-settings'
import {
  landingHeroPadTopClass,
  landingPageGutterClass,
  landingSectionInnerClass,
} from '@/lib/landing-page-layout'
import { landingUltraHeadingClass } from '@/lib/landing-page-typography'
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
        'relative overflow-hidden bg-background py-0',
        '-mt-14',
        landingPageGutterClass,
      )}
    >
      <div
        className={cn(
          landingSectionInnerClass,
          landingHeroPadTopClass,
          'flex min-h-[min(72vh,40rem)] flex-col pb-12 md:pb-16 lg:pb-20',
        )}
      >
        <p className="flex items-center gap-2.5 text-sm font-medium tracking-tight text-foreground md:text-[15px]">
          <span className="size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden />
          {contact.heroEyebrow}
        </p>

        <div className="mt-auto grid gap-10 pt-12 md:grid-cols-12 md:items-end md:gap-8 lg:gap-12 md:pt-16 lg:pt-20">
          <h1
            id="contact-hero-heading"
            className={cn(
              'font-display text-balance font-medium leading-[1.02] tracking-[-0.03em] text-foreground',
              'text-[2.65rem] sm:text-5xl md:col-span-7 md:text-[3.25rem] lg:text-7xl xl:text-[5.25rem]',
              landingUltraHeadingClass,
            )}
          >
            {contact.heroLine1}
            <br />
            {contact.heroLine2}
            <span className="font-light italic text-signal">{contact.heroAccent}</span>
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
