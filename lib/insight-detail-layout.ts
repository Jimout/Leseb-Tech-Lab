import { cn } from '@/lib/utils'

/**
 * Hero title + main photo: pushed right vs default gutter.
 * `pl-*` in `insightDetailContentPad` uses the same steps so body aligns with the image.
 */
export const insightHeroIntroAlign = cn(
  'left-12 sm:left-14 md:left-16',
  'lg:left-24 xl:left-28 2xl:left-32 3xl:left-40 4xl:left-48',
)

/** Insight article: extra left inset; right matches global `containerPaddingClass`. */
export const insightDetailContentPad = cn(
  'pl-12 sm:pl-14 md:pl-16 lg:pl-24 xl:pl-28 2xl:pl-32 3xl:pl-40 4xl:pl-48',
  'pr-8 sm:pr-10 md:pr-12 lg:pr-14 xl:pr-16 2xl:pr-20 3xl:pr-28 4xl:pr-32',
)
