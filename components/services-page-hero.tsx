import {
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

export function ServicesPageHero() {
  return (
    <section
      data-nav-surface="dark"
      aria-labelledby="services-hero-heading"
      className={cn(
        'relative min-h-[min(100dvh,56rem)] overflow-hidden bg-background',
        '-mt-14 pt-28 sm:pt-32 md:pt-36 lg:pt-40',
        'pb-14 md:pb-20 lg:pb-24',
        landingPageGutterClass,
      )}
    >
      <div
        className={cn(
          'relative mx-auto flex min-h-[calc(100dvh-10rem)] min-w-0 flex-col',
          landingPageContentMaxClass,
        )}
      >
        <p className="flex items-center gap-2.5 text-sm font-medium tracking-tight text-foreground md:text-[15px]">
          <span className="size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden />
          Services
        </p>

        <div className="mt-auto grid gap-10 pt-16 md:grid-cols-12 md:items-end md:gap-8 lg:gap-12 md:pt-20">
          <h1
            id="services-hero-heading"
            className={cn(
              'font-display text-balance font-medium leading-[1.02] tracking-[-0.03em] text-foreground',
              'text-[2.65rem] sm:text-5xl md:col-span-7 md:text-[3.25rem] lg:text-7xl xl:text-[5.25rem]',
            )}
          >
            We&apos;re a human-centered
            <br />
            tech lab with
            <br />
            <span className="font-light italic">deep expertise.</span>
          </h1>

          <p
            className={cn(
              'max-w-md text-pretty text-base leading-relaxed text-foreground/75',
              'md:col-span-5 md:col-start-8 md:justify-self-end md:text-right md:text-lg lg:max-w-sm lg:text-xl',
            )}
          >
            We bring careful engineering and local context to teams building AI, software, and data products — so what
            you launch respects the people who depend on it.
          </p>
        </div>
      </div>
    </section>
  )
}


