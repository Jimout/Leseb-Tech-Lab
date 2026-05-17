import { pageEyebrowTextClass } from '@/lib/section-kicker-classes'
import { cn } from '@/lib/utils'

/** Insight article pages use the system UI stack — not display/mono marketing fonts. */
export const insightDetailSansClass = 'font-sans hyphens-none'

export const insightDetailHeroTitleClass = cn(
  insightDetailSansClass,
  'text-balance font-semibold leading-[1.12] tracking-tight text-foreground',
  'text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem]',
)

export const insightDetailHeroDescriptionClass = cn(
  insightDetailSansClass,
  'text-pretty text-sm leading-relaxed text-foreground/70 sm:text-[15px] md:text-base',
)

export const insightDetailKickerClass = pageEyebrowTextClass

export const insightDetailSectionTitleClass = cn(
  insightDetailSansClass,
  'text-balance text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl lg:text-3xl',
)

/** Desktop sidebar (TOC + share) — sticks below the site navbar while scrolling the article. */
export const insightDetailSidebarStickyClass = cn(
  'lg:sticky lg:top-24 lg:z-10 lg:self-start',
  'lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain',
)

/** Space between a section title and its body copy. */
export const insightDetailTitleBodyGapClass = 'mt-4 sm:mt-5'

/** Space between article sections. */
export const insightDetailSectionStackClass = 'space-y-8 sm:space-y-10 lg:space-y-12'

export const insightDetailBodyClass = cn(
  insightDetailSansClass,
  'text-sm leading-relaxed text-foreground/70 sm:text-[15px]',
)

export const insightDetailProseClass = cn(
  insightDetailBodyClass,
  'max-w-none',
  '[&_a]:text-signal [&_a]:underline',
  '[&_h2]:scroll-mt-28 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-snug',
  '[&_h2]:sm:text-2xl [&_h2]:lg:text-3xl [&_h2]:mt-8 [&_h2]:sm:mt-10 [&_h2]:mb-4 [&_h2]:sm:mb-5 [&_h2]:first:mt-0',
  '[&_h3]:scroll-mt-28 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:sm:mt-7',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-relaxed [&_p+p]:mt-4 [&_ul]:list-disc [&_ul]:pl-6',
)

export const insightDetailTocLinkClass = cn(
  insightDetailSansClass,
  'text-sm leading-snug',
)

export const insightDetailTocHeadingClass = cn(
  insightDetailSansClass,
  'text-base font-semibold text-foreground sm:text-lg',
)
