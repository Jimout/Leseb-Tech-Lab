import {
  typeBodySm,
  typeFont,
  typeH2,
  typeH3,
  typeLabel,
  typeWeightHeading,
} from '@/lib/type-scale'
import { cn } from '@/lib/utils'

export const workDetailSansClass = cn(typeFont, 'hyphens-none')

export const workDetailHeroTitleClass = typeH2

export const workDetailSplitTitleClass = cn(
  'hyphens-none',
  typeH2,
  'text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.25rem]',
)

export const workDetailSplitBodyClass = cn(
  workDetailSansClass,
  typeBodySm,
  'text-foreground/85 sm:text-[17px] sm:leading-[1.75]',
)

export const workDetailFactLabelClass = cn(workDetailSansClass, 'text-sm text-muted-foreground')

export const workDetailFactValueClass = cn(
  workDetailSansClass,
  'mt-1.5 text-lg leading-snug tracking-tight text-foreground sm:text-xl',
  typeWeightHeading,
)

export const workDetailHeroMediaFrameClass = cn(
  'relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-image-well sm:rounded-3xl',
)

export const workDetailHeroMediaSizes =
  '(max-width: 1024px) 100vw, (max-width: 1536px) calc(100vw - 7rem), min(90vw, 1600px)'

export const workDetailStoryVideoSectionClass = cn(
  'mt-10 sm:mt-12 md:mt-14 lg:mt-16',
)

export const workDetailStoryCopyGridClass = cn(
  'grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-10 lg:gap-x-14 xl:gap-x-16',
  'mt-12 sm:mt-14 md:mt-16 lg:mt-20',
)

export const workDetailStoryGalleryGridClass = cn(
  'grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2',
  'mt-12 sm:mt-14 md:mt-16 lg:mt-20',
)

export const workDetailSplitSecondaryClass = cn(
  workDetailSansClass,
  'text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]',
)

export const workDetailMetaLabelClass = cn(workDetailSansClass, 'text-sm text-muted-foreground')

export const workDetailMetaValueClass = cn(
  workDetailSansClass,
  'mt-1 text-base text-foreground sm:text-lg',
  typeWeightHeading,
)

export const workDetailMainImageHeightClass = cn(
  'relative w-full overflow-hidden rounded-2xl sm:rounded-3xl',
  'aspect-[16/10] min-h-[min(52vh,640px)] sm:min-h-[min(58vh,720px)] lg:min-h-[min(64vh,800px)]',
)
