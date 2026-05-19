import {
  pageEyebrowDotClass,
  pageEyebrowRowClass,
  pageEyebrowTextClass,
} from '@/lib/section-kicker-classes'
import {
  typeAccentItalic,
  typeBody,
  typeCaption,
  typeCardTitle,
  typeCardTitleLg,
  typeFont,
  typeH1,
  typeLabel,
  typeLabelHero,
  typeLabelSm,
  typeLead,
  typeMarquee,
  typeMeta,
  typeTabular,
  typeUiSm,
  typeUiXs,
  typeUltra,
  typeWeightBody,
  typeWeightHeading,
  typeWeightLabel,
} from '@/lib/type-scale'
import { cn } from '@/lib/utils'

export const landingUltraHeadingClass = typeUltra

export const landingBandClass = 'text-foreground'

export const landingSectionKickerClass = cn(pageEyebrowRowClass, pageEyebrowTextClass)

export const landingSectionKickerDotClass = pageEyebrowDotClass

export const landingSectionTitleClass = typeH1

export const landingSectionTitleXLClass = landingSectionTitleClass

export const landingSectionTitleAccentClass = typeAccentItalic

export const landingSectionHeaderGridClass = cn(
  'mb-10 grid gap-10 md:mb-12 md:grid-cols-12 md:items-end md:gap-12 lg:mb-14',
  '2xl:mb-16 2xl:gap-16 3xl:mb-20 3xl:gap-20 4xl:mb-24 4xl:gap-24',
)

export const landingSectionHeaderLeadClass = 'min-w-0 md:col-span-5'

export const landingSectionHeaderAsideClass = cn(
  'flex min-w-0 flex-col items-end md:col-span-6 md:col-start-7',
)

export const landingSectionIntroClass = typeLead

export const landingSectionHeaderIntroClass = cn(
  landingSectionIntroClass,
  'max-w-md text-right text-pretty lg:max-w-sm',
)

export const landingSectionHeaderSplitClass = cn(
  'mb-12 flex min-w-0 flex-col gap-6 sm:mb-14 md:mb-16 md:flex-row md:items-end md:justify-between lg:mb-16 xl:mb-20',
  '2xl:mb-20 3xl:mb-24 4xl:mb-28',
)

export const landingManifestoGridClass = cn(
  'mx-auto grid min-w-0 gap-12 md:grid-cols-12 md:gap-14 lg:gap-16',
  '2xl:gap-20 3xl:gap-24 4xl:gap-28',
)

export const landingManifestoAsideClass = 'md:col-span-3'

export const landingManifestoBodyClass = cn(
  'min-w-0 space-y-12 sm:space-y-14 md:col-span-9 md:space-y-16 lg:space-y-20 2xl:space-y-24',
)

export const landingManifestoLeadClass = cn(
  typeH1,
  'text-3xl md:text-5xl lg:text-6xl',
)

export const landingManifestoAsideTitleClass = cn(
  typeFont,
  'text-balance text-2xl leading-snug tracking-tight text-foreground/90 font-semibold',
  'md:text-3xl lg:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl',
)

export const landingBodyClass = typeBody

export const landingCaptionClass = typeCaption

export const landingMetaClass = typeMeta

export const landingHeroEyebrowClass = typeLabelHero

/** Home hero — “Technology / built for humans.” (larger than `typeDisplay`). */
export const landingHeroTitleClass = cn(
  typeFont,
  typeWeightHeading,
  'text-balance leading-[0.92] tracking-[-0.04em]',
  'text-[2.2rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.8rem] xl:text-[4.6rem]',
  '2xl:text-[8rem] 3xl:text-[10rem] 4xl:text-[12rem]',
)

export const landingHeroSubkickerClass = cn(
  'mb-3 sm:mb-4 md:mb-5',
  pageEyebrowRowClass,
  pageEyebrowTextClass,
)

export const landingHeroBodyClass = cn(
  typeFont,
  typeWeightBody,
  'text-balance text-base leading-relaxed text-foreground/80 sm:text-lg md:text-xl xl:text-2xl',
  '2xl:text-[1.7rem] 3xl:text-[1.85rem] 4xl:text-[2rem]',
)

export const landingHeroAsideKickerClass = typeLabelSm

export const landingHeroCtaClass = cn(
  'group inline-flex items-center gap-3 rounded-full bg-signal text-secondary-foreground pl-6 pr-2 py-2 transition-transform hover:scale-[1.03]',
  typeUiSm,
  'sm:text-xs',
)

export const landingMarqueeBandClass =
  'relative overflow-hidden border-t border-border/80 bg-background py-4 md:py-5'

export const landingMarqueeFadeClass =
  'pointer-events-none absolute inset-y-0 z-10 w-16 bg-linear-to-r from-background to-transparent sm:w-28'

export const landingMarqueeFadeRightClass = cn(landingMarqueeFadeClass, 'right-0 bg-linear-to-l')

export const landingMarqueeTrackClass = cn('marquee flex w-max shrink-0 items-center', typeMarquee)

export const landingMarqueeUnitClass = 'inline-flex shrink-0 items-center gap-8 md:gap-10'

export const landingMarqueeWordMutedClass = 'text-muted-foreground'

export const landingMarqueeWordMidClass = 'text-foreground/80'

export const landingMarqueeWordAccentClass = 'text-signal'

export const landingMarqueeSepClass = 'select-none text-foreground/35'

export const landingMediaMetaClass = typeCaption

export const landingCardTagClass = cn(
  'rounded-full border border-foreground/10 bg-background/40 px-3 py-1 backdrop-blur',
)

export const landingCardTitleClass = cn(
  typeFont,
  'mb-3 flex flex-wrap items-center gap-2 font-semibold tracking-tight sm:gap-3',
  'text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl',
)

export const landingCardDescClass = cn(
  'max-w-md text-balance text-foreground/70',
  '2xl:text-lg 3xl:text-xl 4xl:text-xl',
)

export const workLabCardShellClass = cn(
  'group relative flex min-h-0 flex-col overflow-hidden rounded-lg border border-catalog-card-border bg-catalog-card lg:rounded-xl',
  'text-left outline-none transition-[border-color,background-color,box-shadow] duration-500',
  'hover:border-foreground/18 hover:bg-catalog-card-hover hover:shadow-[0_16px_36px_-24px_rgba(0,0,0,0.55)]',
  'focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const workLabCardMediaClass = cn(
  'relative aspect-[5/3] w-full shrink-0 overflow-hidden bg-catalog-card-media lg:aspect-[2/1]',
)

export const workLabCardLandingMediaClass = cn(
  'relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-catalog-card-media lg:aspect-[4/3]',
)

export const workLabCardBodyClass = cn(
  'flex min-w-0 flex-1 flex-col gap-1 border-t border-catalog-card-border px-2.5 py-2 sm:px-3 sm:py-2.5 lg:gap-1.5 lg:px-3.5 lg:py-3',
)

export const workLabCardLandingBodyClass = cn(
  'flex min-w-0 flex-1 flex-col gap-1.5 border-t border-catalog-card-border px-2.5 py-2.5 sm:px-3 sm:py-3 lg:gap-2 lg:px-3.5 lg:py-3.5',
)

export const workLabCardHeaderClass = cn('flex items-center justify-between gap-2')

export const workLabCardTagClass = cn(
  landingMediaMetaClass,
  'min-w-0 truncate text-[9px] tracking-[0.22em] text-foreground/65',
)

export const workLabCardYearClass = cn(
  typeTabular,
  'shrink-0 text-[9px] tracking-[0.18em] text-foreground/55 uppercase',
  typeWeightLabel,
)

export const workLabCardTitleClass = typeCardTitle

export const workLabCardFooterClass = cn(
  'mt-auto flex items-center justify-between gap-2 border-t border-catalog-card-border/80 pt-1 lg:pt-1.5',
)

export const workLabCardLocationClass = cn(
  'min-w-0 truncate text-[10px] leading-snug text-muted-foreground lg:text-[11px]',
)

export const workLabCardCtaClass = cn(
  'inline-flex shrink-0 items-center gap-0.5 rounded-full border border-foreground/20 bg-transparent',
  'px-1.5 py-0.5 text-foreground/85 transition-colors duration-500',
  typeUiXs,
  'lg:px-2 lg:py-1 lg:text-[8px] lg:tracking-[0.16em] xl:text-[9px] group-hover:border-signal/45 group-hover:text-signal',
)

export const workLabCardLandingGridClass = cn(
  'grid list-none grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6',
)

export const workLabCardGridClass = cn(
  'grid list-none grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6',
)

export const landingEmptyCoverClass = cn(typeFont, 'text-xs font-medium text-muted-foreground')

export const landingInsightCardClass = cn(
  workLabCardShellClass,
  'rounded-2xl lg:rounded-2xl',
)

export const landingInsightCardMediaTitleClass = typeCardTitleLg

export const landingInsightCardMediaDescClass = cn(
  'line-clamp-2 text-xs leading-relaxed text-foreground/88 sm:text-sm',
)

export const landingInsightCardFooterClass = cn(
  'relative flex min-h-17 items-center justify-between gap-2.5 border-t border-foreground/10',
  'bg-background/35 px-3.5 py-2.5 transition-colors duration-500 group-hover:bg-foreground/[0.07] sm:min-h-18 sm:px-4 sm:py-3',
)

export const landingInsightCardPillClass = cn(
  'absolute right-2.5 top-2.5 z-10 rounded-full bg-background/50 px-2.5 py-0.5 backdrop-blur-sm sm:right-3 sm:top-3',
  typeUiXs,
  'text-foreground',
)

export const landingInsightCardCtaClass = cn(
  'inline-flex shrink-0 items-center gap-1 rounded-full border border-foreground/25 bg-transparent',
  'px-2.5 py-1.5 text-foreground transition-colors duration-500 sm:px-3 sm:py-2 sm:text-[10px]',
  typeUiXs,
  'group-hover:border-signal/50 group-hover:text-signal',
)

export const landingInsightStripClass = cn(
  'flex min-w-0 w-full gap-5 overflow-x-auto pb-2 sm:gap-6 md:gap-7',
  'snap-x snap-proximity md:snap-mandatory lg:px-0',
  '[overflow-anchor:none]',
  'overscroll-x-contain [touch-action:pan-x_pan-y]',
  'select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  'max-md:cursor-default md:cursor-grab md:active:cursor-grabbing',
)

/** Same column width as `workLabCardLandingGridClass` (2-col sm gap-4, 3-col lg gap-5, xl gap-6). */
export const landingInsightCardWidthClass = cn(
  'w-full max-w-full shrink-0 snap-start',
  'sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3rem)/3)]',
)

export const landingStripNavButtonClass = cn(
  'inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/20',
  'text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/5',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-35',
)

export const landingStripDotInactiveClass = 'w-2 bg-foreground/30 hover:bg-foreground/50'

export const landingStripDotActiveClass = 'w-7 bg-signal'

export const catalogFilterPillBaseClass = cn(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5',
  typeFont,
  'text-[11px] font-medium tracking-tight transition-colors duration-300',
  'sm:px-3.5 sm:py-2 sm:text-xs',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const detailHeroTopicPillClass = cn(
  catalogFilterPillBaseClass,
  'border-foreground/15 bg-foreground/[0.04] text-muted-foreground',
  'hover:border-foreground/25 hover:bg-foreground/[0.07] hover:text-foreground',
)

export const detailHeroTopicPillOnImageClass = cn(
  detailHeroTopicPillClass,
  'border-white/25 bg-white/15 text-white backdrop-blur-sm',
  'hover:border-white/40 hover:bg-white/25 hover:text-white',
)

export const catalogFilterPillInactiveClass = detailHeroTopicPillClass

export const catalogFilterPillActiveClass = cn(
  catalogFilterPillBaseClass,
  'border-signal/55 bg-signal/10 text-foreground',
)

export const catalogFilterCountClass = 'tabular-nums text-[0.92em] text-foreground/50'

export const catalogFilterCountActiveClass = 'tabular-nums text-[0.92em] text-signal'

export const landingNewsletterPanelClass = cn(
  'overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.04] backdrop-blur-[2px]',
  'sm:rounded-2xl',
)

export const landingNewsletterTitleClass = cn(
  typeFont,
  'text-balance font-semibold leading-[1.12] tracking-tight text-foreground',
  'text-3xl sm:text-4xl lg:text-[2.625rem] lg:leading-[1.08] xl:text-5xl 2xl:text-5xl',
)

export const landingNewsletterFieldClass = cn(
  'h-12 w-full rounded-lg border border-border bg-background px-4',
  typeFont,
  'text-sm text-foreground placeholder:text-muted-foreground',
  'outline-none transition-[border-color,box-shadow]',
  'focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-signal/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const landingNewsletterSubmitClass = cn(
  'h-12 shrink-0 rounded-lg px-8 focus-visible:ring-signal/50 focus-visible:ring-offset-background md:px-10',
  typeUiSm,
)

export const footerNewsletterFieldClass = cn(
  'h-11 w-full rounded-lg border border-white/15 bg-white/5 px-4',
  typeFont,
  'text-sm text-white placeholder:text-white/45',
  'outline-none transition-[border-color,box-shadow]',
  'focus-visible:border-signal/50 focus-visible:ring-2 focus-visible:ring-signal/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const footerNewsletterSubmitClass = cn(
  'h-11 shrink-0 rounded-lg px-6 focus-visible:ring-signal/50 focus-visible:ring-offset-background sm:px-8',
  typeUiSm,
)

export const landingPanelEaseClass = 'ease-[var(--landing-panel-ease)]'

export const landingPillarGridClass = cn(
  'grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4',
)

/** Services / Approach four-up card titles — fixed 2xl scale (unchanged from pre–type-scale refactor). */
export const landingPillarTitleClass = cn(
  typeFont,
  'mb-3 text-2xl tracking-tight transition-colors duration-500 group-hover:text-foreground',
  '2xl:text-3xl 3xl:text-4xl 4xl:text-[2.5rem]',
)

export const landingPillarBodyClass = cn(
  typeFont,
  'text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-foreground/85 font-normal',
  '2xl:text-base 3xl:text-lg 4xl:text-lg',
)

export const landingPillarCardClass = cn(
  'group relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden bg-background',
  'p-8 sm:min-h-[280px] sm:p-9 md:min-h-[300px] md:p-10',
  '2xl:min-h-[320px] 2xl:p-12 3xl:min-h-[340px] 3xl:p-14 4xl:min-h-[360px] 4xl:p-16',
)

export const servicesPageRootClass = typeFont

export const servicesHeroIntroClass = cn(
  landingSectionIntroClass,
  'max-w-md md:text-right lg:max-w-sm',
)

export const servicesPracticeDescriptionClass = cn(landingSectionIntroClass, 'max-w-lg text-foreground/80')

export const servicesOfferingIndexClass = cn(
  typeTabular,
  'w-7 shrink-0 text-sm tracking-[0.2em] text-muted-foreground md:text-base',
  typeWeightLabel,
)

export const servicesOfferingLabelClass = cn(
  typeFont,
  'text-base font-medium leading-snug text-foreground md:text-lg lg:text-xl',
)
