import { pageEyebrowTextClass } from '@/lib/section-kicker-classes'
import { landingNewsletterPanelClass } from '@/lib/landing-page-typography'
import {
  typeBodySm,
  typeFont,
  typeH2,
  typeH3,
  typeH4,
} from '@/lib/type-scale'
import { cn } from '@/lib/utils'

export const insightDetailSansClass = cn(typeFont, 'hyphens-none')

export const insightDetailHeroTitleClass = cn(
  insightDetailSansClass,
  typeH2,
  'text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem]',
)

export const insightDetailHeroDescriptionClass = typeBodySm

/** Cover image — aspect ratio below 2xl; fixed height at 2xl+. */
export const insightDetailHeroImageClass = cn(
  'group relative mt-8 aspect-[16/9] w-full max-h-[14.5rem] overflow-hidden rounded-2xl bg-image-well',
  'sm:mt-10 sm:max-h-[15.5rem] md:max-h-[17rem] md:rounded-3xl lg:max-h-[19rem]',
  '2xl:aspect-auto 2xl:h-[36rem] 2xl:max-h-none',
  '3xl:h-[42rem]',
  '4xl:h-[48rem]',
  'outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const insightDetailKickerClass = pageEyebrowTextClass

export const insightDetailSectionTitleClass = cn(insightDetailSansClass, typeH3)

export const insightDetailSidebarStickyClass = cn(
  'lg:sticky lg:top-24 lg:z-10 lg:self-start',
  'lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain',
)

/** Article band shell. */
export const insightDetailArticleRailPadClass = 'w-full min-w-0 box-border'

/** Blog column — fills its grid cell. */
export const insightDetailBlogMeasureClass = 'w-full min-w-0'

export const insightDetailNewsletterRailPanelClass = cn(landingNewsletterPanelClass, 'p-5 sm:p-6')

export const insightDetailTitleBodyGapClass = 'mt-4 sm:mt-5'

export const insightDetailSectionStackClass = 'space-y-8 sm:space-y-10 lg:space-y-12'

export const insightDetailBodyClass = typeBodySm

/** Blog column — use full grid width (no narrow prose rail). */
export const insightDetailBlogContentClass = 'max-w-none w-full'

export const insightDetailProseClass = cn(
  insightDetailBodyClass,
  'max-w-none',
  '[&_a]:text-signal [&_a]:underline',
  '[&_h2]:scroll-mt-28 [&_h2]:font-sans [&_h2]:font-semibold [&_h2]:leading-snug',
  '[&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:lg:text-3xl [&_h2]:mt-8 [&_h2]:sm:mt-10 [&_h2]:mb-4 [&_h2]:sm:mb-5 [&_h2]:first:mt-0',
  '[&_h3]:scroll-mt-28 [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:sm:mt-7',
  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:sm:pl-6 [&_p]:leading-relaxed [&_p+p]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:sm:pl-6',
)

export const insightDetailTocLinkClass = cn(insightDetailSansClass, 'text-sm leading-snug')

export const insightDetailTocHeadingClass = cn(insightDetailSansClass, typeH4, 'text-base sm:text-lg')
