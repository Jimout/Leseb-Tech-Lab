import {
  pageEyebrowDotClass,
  pageEyebrowRowClass,
  pageEyebrowTextClass,
} from '@/lib/section-kicker-classes'
import { cn } from '@/lib/utils'

/** Section headlines — scales with insights showcase from `2xl` up. */
export const landingUltraHeadingClass = cn(
  '2xl:text-[4.25rem] 2xl:leading-[1.08]',
  '3xl:text-[4.9rem] 3xl:leading-[1.07]',
  '4xl:text-[5.5rem] 4xl:leading-[1.06]',
)

/** Dark-band sections inherit `main` foreground; explicit for clarity in nested trees. */
export const landingBandClass = 'text-foreground'

/** Section / page eyebrow row — green dot, lemon mono label (work index style). */
export const landingSectionKickerClass = cn(pageEyebrowRowClass, pageEyebrowTextClass)

export const landingSectionKickerDotClass = pageEyebrowDotClass

/** Primary section headline scale. */
export const landingSectionTitleClass = cn(
  'font-display text-balance font-semibold leading-[1.14] tracking-tight text-foreground',
  'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  landingUltraHeadingClass,
)

export const landingSectionTitleXLClass = landingSectionTitleClass

export const landingSectionTitleAccentClass = 'font-light italic text-signal'

/** Label + title | supporting copy (Lab, Approach). */
export const landingSectionHeaderGridClass = cn(
  'mb-10 grid gap-10 md:mb-12 md:grid-cols-12 md:items-end md:gap-12 lg:mb-14',
  '2xl:mb-16 2xl:gap-16 3xl:mb-20 3xl:gap-20 4xl:mb-24 4xl:gap-24',
)

export const landingSectionHeaderLeadClass = 'min-w-0 md:col-span-5'

export const landingSectionHeaderAsideClass = cn(
  'flex min-w-0 flex-col items-end md:col-span-6 md:col-start-7',
)

export const landingSectionIntroClass = cn(
  'text-balance text-lg leading-relaxed text-muted-foreground md:text-xl',
  '2xl:text-xl 3xl:text-2xl 4xl:text-2xl',
)

/** Intro copy in homepage section headers (Services / Approach asides). */
export const landingSectionHeaderIntroClass = cn(
  landingSectionIntroClass,
  'max-w-md text-right text-pretty lg:max-w-sm',
)

/** Title block + trailing CTA (Works, Insights). */
export const landingSectionHeaderSplitClass = cn(
  'mb-12 flex min-w-0 flex-col gap-6 sm:mb-14 md:mb-16 md:flex-row md:items-end md:justify-between lg:mb-16 xl:mb-20',
  '2xl:mb-20 3xl:mb-24 4xl:mb-28',
)

/** Manifesto column layout. */
export const landingManifestoGridClass = cn(
  'mx-auto grid min-w-0 gap-12 md:grid-cols-12 md:gap-14 lg:gap-16',
  '2xl:gap-20 3xl:gap-24 4xl:gap-28',
)

export const landingManifestoAsideClass = 'md:col-span-3'

export const landingManifestoBodyClass = cn(
  'min-w-0 space-y-12 sm:space-y-14 md:col-span-9 md:space-y-16 lg:space-y-20 2xl:space-y-24',
)

export const landingManifestoLeadClass = cn(
  'font-display text-balance font-semibold leading-[1.14] tracking-tight text-foreground',
  'text-3xl md:text-5xl lg:text-6xl',
  landingUltraHeadingClass,
)

export const landingManifestoAsideTitleClass = cn(
  'font-display text-balance text-2xl leading-snug tracking-tight text-foreground/90',
  'md:text-3xl lg:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl',
)

export const landingBodyClass = cn(
  'text-base leading-relaxed text-foreground/70 md:text-lg',
  '2xl:text-xl 3xl:text-2xl 4xl:text-2xl',
)

export const landingCaptionClass =
  'font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/80'

export const landingMetaClass = 'font-mono text-xs text-muted-foreground'

/** Hero scale. */
export const landingHeroEyebrowClass = cn(
  'mb-6 font-mono text-xs uppercase tracking-[0.3em] text-signal',
  'sm:mb-7 md:mb-8 lg:mb-9 xl:mb-10',
)

export const landingHeroTitleClass = cn(
  'font-display font-medium leading-[0.92] tracking-[-0.04em] text-balance',
  'text-[2.2rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.8rem] xl:text-[4.6rem]',
  '2xl:text-[6rem] 3xl:text-[7rem] 4xl:text-[8rem]',
)

export const landingHeroSubkickerClass = cn(
  'mb-3 sm:mb-4 md:mb-5',
  pageEyebrowRowClass,
  pageEyebrowTextClass,
)

export const landingHeroBodyClass = cn(
  'text-balance text-base leading-relaxed text-foreground/80 sm:text-lg md:text-xl xl:text-2xl',
  '2xl:text-[1.7rem] 3xl:text-[1.85rem] 4xl:text-[2rem]',
)

export const landingHeroAsideKickerClass =
  'mb-2 font-mono text-xs uppercase tracking-[0.25em] text-signal'

/** Home language ticker (below hero). */
export const landingMarqueeBandClass =
  'relative overflow-hidden border-t border-border/80 bg-background py-4 md:py-5'

export const landingMarqueeFadeClass =
  'pointer-events-none absolute inset-y-0 z-10 w-16 bg-linear-to-r from-background to-transparent sm:w-28'

export const landingMarqueeFadeRightClass = cn(landingMarqueeFadeClass, 'right-0 bg-linear-to-l')

export const landingMarqueeTrackClass = cn(
  'marquee flex w-max shrink-0 items-center',
  'font-mono text-xs uppercase tracking-[0.24em] sm:text-sm sm:tracking-[0.26em] md:text-base md:tracking-[0.28em]',
)

export const landingMarqueeUnitClass = 'inline-flex shrink-0 items-center gap-8 md:gap-10'

export const landingMarqueeWordMutedClass = 'text-muted-foreground'

export const landingMarqueeWordMidClass = 'text-foreground/80'

export const landingMarqueeWordAccentClass = 'text-signal'

export const landingMarqueeSepClass = 'select-none text-foreground/35'

/** Media / project cards (landing works + work index). */
export const landingMediaMetaClass =
  'font-mono text-[10px] tracking-[0.25em] text-foreground/80 uppercase'

export const landingCardTagClass = cn(
  'rounded-full border border-foreground/10 bg-background/40 px-3 py-1 backdrop-blur',
)

export const landingCardTitleClass = cn(
  'font-display mb-3 flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight sm:gap-3 sm:text-3xl md:text-4xl lg:text-5xl',
  '2xl:text-5xl 3xl:text-6xl 4xl:text-7xl',
)

export const landingCardDescClass = cn(
  'max-w-md text-balance text-foreground/70',
  '2xl:text-lg 3xl:text-xl 4xl:text-xl',
)

/** Work index / lab — boxed project cards (system surfaces; not insight overlay cards). */
export const workLabCardShellClass = cn(
  'group relative flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-box lg:rounded-xl',
  'text-left outline-none transition-[border-color,background-color,box-shadow] duration-500',
  'hover:border-foreground/20 hover:bg-card-hover hover:shadow-[0_14px_32px_-24px_rgba(0,0,0,0.4)]',
  'focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const workLabCardMediaClass = cn(
  'relative aspect-[5/3] w-full shrink-0 overflow-hidden bg-image-well lg:aspect-[2/1]',
)

/** Taller media block for landing single-row cards. */
export const workLabCardLandingMediaClass = cn(
  'relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-image-well lg:aspect-[4/3]',
)

export const workLabCardBodyClass = cn(
  'flex min-w-0 flex-1 flex-col gap-1 border-t border-border px-2.5 py-2 sm:px-3 sm:py-2.5 lg:gap-1.5 lg:px-3.5 lg:py-3',
)

export const workLabCardLandingBodyClass = cn(
  'flex min-w-0 flex-1 flex-col gap-1.5 border-t border-border px-2.5 py-2.5 sm:px-3 sm:py-3 lg:gap-2 lg:px-3.5 lg:py-3.5',
)

export const workLabCardHeaderClass = cn('flex items-center justify-between gap-2')

export const workLabCardTagClass = cn(
  landingMediaMetaClass,
  'min-w-0 truncate text-[9px] tracking-[0.22em] text-foreground/65',
)

export const workLabCardYearClass = cn(
  'shrink-0 font-mono text-[9px] tabular-nums tracking-[0.18em] text-foreground/55 uppercase',
)

export const workLabCardTitleClass = cn(
  'font-display text-pretty text-sm font-semibold leading-[1.15] tracking-tight text-foreground',
  'line-clamp-2 transition-colors duration-500 group-hover:text-signal sm:text-[0.95rem] lg:text-base xl:text-[1.05rem]',
)

export const workLabCardFooterClass = cn(
  'mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-1 lg:pt-1.5',
)

export const workLabCardLocationClass = cn(
  'min-w-0 truncate text-[10px] leading-snug text-muted-foreground lg:text-[11px]',
)

export const workLabCardCtaClass = cn(
  'inline-flex shrink-0 items-center gap-0.5 rounded-full border border-foreground/20 bg-transparent',
  'px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-foreground/85 transition-colors duration-500',
  'lg:px-2 lg:py-1 lg:text-[8px] lg:tracking-[0.16em] xl:text-[9px] group-hover:border-signal/45 group-hover:text-signal',
)

/** Landing “In the Lab” — one row of three on large screens. */
export const workLabCardLandingGridClass = cn(
  'grid list-none grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6',
)

/** Work index — catalog grid. */
export const workLabCardGridClass = cn(
  'grid list-none grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6',
)

export const landingEmptyCoverClass = 'text-xs font-medium text-muted-foreground'

/** Insights strip card shell. */
export const landingInsightCardClass = cn(
  'group relative flex max-w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-foreground/12',
  'bg-foreground/[0.04] text-left outline-none backdrop-blur-[2px]',
  'transition-shadow duration-500 hover:border-foreground/18',
  'hover:shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--background)_85%,transparent)]',
  'focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const landingInsightCardMediaTitleClass = cn(
  'font-display text-base font-semibold leading-[1.15] tracking-tight text-foreground sm:text-lg',
)

export const landingInsightCardMediaDescClass = cn(
  'line-clamp-2 text-xs leading-relaxed text-foreground/88 sm:text-sm',
)

export const landingInsightCardFooterClass = cn(
  'relative flex min-h-17 items-center justify-between gap-2.5 border-t border-foreground/10',
  'bg-background/35 px-3.5 py-2.5 transition-colors duration-500 group-hover:bg-foreground/[0.07] sm:min-h-18 sm:px-4 sm:py-3',
)

export const landingInsightCardPillClass = cn(
  'absolute right-2.5 top-2.5 z-10 rounded-full bg-background/50 px-2.5 py-0.5',
  'font-mono text-[9px] uppercase tracking-[0.2em] text-foreground backdrop-blur-sm sm:right-3 sm:top-3',
)

export const landingInsightCardCtaClass = cn(
  'inline-flex shrink-0 items-center gap-1 rounded-full border border-foreground/25 bg-transparent',
  'px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground transition-colors duration-500',
  'sm:px-3 sm:py-2 sm:text-[10px] group-hover:border-signal/50 group-hover:text-signal',
)

/** Horizontal strip + card widths (insights). */
export const landingInsightStripClass = cn(
  'flex min-w-0 w-full gap-5 overflow-x-auto pb-2 sm:gap-6 md:gap-7',
  'snap-x snap-proximity md:snap-mandatory lg:px-0',
  '[overflow-anchor:none]',
  'overscroll-x-contain [touch-action:pan-x_pan-y]',
  'select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  'max-md:cursor-default md:cursor-grab md:active:cursor-grabbing',
)

/** Card widths — aligned with `insights-showcase` strip at `2xl` / `3xl` / `4xl`. */
export const landingInsightCardWidthClass = cn(
  'w-[min(82vw,17.5rem)] max-w-none shrink-0 snap-start sm:w-[min(78vw,18.5rem)]',
  'md:w-[calc((100%-1.25rem)/2.5)] lg:w-[calc((100%-2rem)/2.75)] xl:w-[calc((100%-2.5rem)/3)]',
  '2xl:w-[calc((100%-2.5rem)/2.3)] 3xl:w-[calc((100%-2.5rem)/2.15)] 4xl:w-[calc((100%-2.5rem)/2)]',
)

/** Strip pagination controls (landing insights). */
export const landingStripNavButtonClass = cn(
  'inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/20',
  'text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/5',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-35',
)

export const landingStripDotInactiveClass = 'w-2 bg-foreground/30 hover:bg-foreground/50'

export const landingStripDotActiveClass = 'w-7 bg-signal'

/** Shared shell for topic pills and catalog filters. */
export const catalogFilterPillBaseClass = cn(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5',
  'font-sans text-[11px] font-medium tracking-tight transition-colors duration-300',
  'sm:px-3.5 sm:py-2 sm:text-xs',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

/** Topic labels — work detail header, insight detail hero (on page background). */
export const detailHeroTopicPillClass = cn(
  catalogFilterPillBaseClass,
  'border-foreground/15 bg-foreground/[0.04] text-muted-foreground',
  'hover:border-foreground/25 hover:bg-foreground/[0.07] hover:text-foreground',
)

/** Topic labels over hero media — insight detail hero image overlay. */
export const detailHeroTopicPillOnImageClass = cn(
  detailHeroTopicPillClass,
  'border-white/25 bg-white/15 text-white backdrop-blur-sm',
  'hover:border-white/40 hover:bg-white/25 hover:text-white',
)

/** Work / insights catalog filter pills (`/work`, `/insights`). */
export const catalogFilterPillInactiveClass = detailHeroTopicPillClass

export const catalogFilterPillActiveClass = cn(
  catalogFilterPillBaseClass,
  'border-signal/55 bg-signal/10 text-foreground',
)

export const catalogFilterCountClass = 'tabular-nums text-[0.92em] text-foreground/50'

export const catalogFilterCountActiveClass = 'tabular-nums text-[0.92em] text-signal'

/** Newsletter / subscribe panel on insights and similar pages. */
export const landingNewsletterPanelClass = cn(
  'overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.04] backdrop-blur-[2px]',
  'sm:rounded-2xl',
)

export const landingNewsletterTitleClass = cn(
  'font-display text-balance font-semibold leading-[1.12] tracking-tight text-foreground',
  'text-3xl sm:text-4xl lg:text-[2.625rem] lg:leading-[1.08] xl:text-5xl 2xl:text-5xl',
)

export const landingNewsletterFieldClass = cn(
  'h-12 w-full rounded-lg border border-border bg-background px-4',
  'font-sans text-sm text-foreground placeholder:text-muted-foreground',
  'outline-none transition-[border-color,box-shadow]',
  'focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-signal/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const landingNewsletterSubmitClass = cn(
  'h-12 shrink-0 rounded-lg px-8 font-mono text-[10px] uppercase tracking-[0.18em]',
  'focus-visible:ring-signal/50 focus-visible:ring-offset-background',
  'md:px-10',
)

/** Compact subscribe field in site footer (dark band). */
export const footerNewsletterFieldClass = cn(
  'h-11 w-full rounded-lg border border-white/15 bg-white/5 px-4',
  'font-sans text-sm text-white placeholder:text-white/45',
  'outline-none transition-[border-color,box-shadow]',
  'focus-visible:border-signal/50 focus-visible:ring-2 focus-visible:ring-signal/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const footerNewsletterSubmitClass = cn(
  'h-11 shrink-0 rounded-lg px-6 font-mono text-[10px] uppercase tracking-[0.18em]',
  'focus-visible:ring-signal/50 focus-visible:ring-offset-background sm:px-8',
)

/** Motion token — matches `:root --landing-panel-ease`. */
export const landingPanelEaseClass = 'ease-[var(--landing-panel-ease)]'

/** Services / Approach four-up grid. */
export const landingPillarGridClass = cn(
  'grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4',
)

/** Single pillar card — hover uses accent corners + color only (no scale/zoom). */
export const landingPillarTitleClass = cn(
  'mb-3 font-display text-2xl tracking-tight transition-colors duration-500 group-hover:text-foreground',
  '2xl:text-3xl 3xl:text-4xl 4xl:text-[2.5rem]',
)

export const landingPillarBodyClass = cn(
  'text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-foreground/85',
  '2xl:text-base 3xl:text-lg 4xl:text-lg',
)

export const landingPillarCardClass = cn(
  'group relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden bg-background',
  'p-8 sm:min-h-[280px] sm:p-9 md:min-h-[300px] md:p-10',
  '2xl:min-h-[320px] 2xl:p-12 3xl:min-h-[340px] 3xl:p-14 4xl:min-h-[360px] 4xl:p-16',
)

/** Services page — Space Grotesk stack (same as landing); no separate display face. */
export const servicesPageRootClass = 'font-sans'

export const servicesHeroIntroClass = cn(
  landingSectionIntroClass,
  'max-w-md md:text-right lg:max-w-sm',
)

export const servicesPracticeDescriptionClass = cn(landingSectionIntroClass, 'max-w-lg text-foreground/80')

export const servicesOfferingIndexClass = cn(
  'w-7 shrink-0 font-mono text-sm tabular-nums tracking-[0.2em] text-muted-foreground md:text-base',
)

export const servicesOfferingLabelClass = cn(
  'font-sans text-base font-medium leading-snug text-foreground md:text-lg lg:text-xl',
)
