import { cn } from '@/lib/utils'

export const workDetailSansClass = 'font-sans hyphens-none'

export const workDetailHeroTitleClass = cn(
  'font-display text-balance font-semibold leading-[1.06] tracking-tight text-foreground',
  'text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]',
)

export const workDetailSplitTitleClass = cn(
  'font-display text-balance font-semibold leading-[1.05] tracking-tight text-foreground',
  'text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.25rem]',
)

export const workDetailSplitBodyClass = cn(
  workDetailSansClass,
  'text-pretty text-base leading-relaxed text-muted-foreground sm:text-[17px] sm:leading-[1.65]',
)

export const workDetailSplitSecondaryClass = cn(
  workDetailSansClass,
  'text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]',
)

export const workDetailMetaLabelClass = cn(
  workDetailSansClass,
  'text-sm text-muted-foreground',
)

export const workDetailMetaValueClass = cn(
  workDetailSansClass,
  'mt-1 text-base font-semibold text-foreground sm:text-lg',
)

/** Full-bleed media in flexible content blocks below the split section. */
export const workDetailMainImageHeightClass = cn(
  'relative w-full overflow-hidden rounded-2xl sm:rounded-3xl',
  'aspect-[16/10] min-h-[min(52vh,640px)] sm:min-h-[min(58vh,720px)] lg:min-h-[min(64vh,800px)]',
)
