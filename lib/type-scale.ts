import { cn } from '@/lib/utils'

/**
 * Site-wide typography — Space Grotesk only.
 * Weights: body/lead = normal (400), labels/UI = medium (500), headings = semibold (600).
 */
export const typeFont = 'font-sans'

export const typeWeightBody = 'font-normal'
export const typeWeightLabel = 'font-medium'
export const typeWeightHeading = 'font-semibold'

/** Accent lines inside headlines (italic, not a separate face). */
export const typeAccentItalic = 'font-normal italic text-signal'

/** Extra-large breakpoint steps shared by display + section titles. */
export const typeUltra = cn(
  '2xl:text-[4.25rem] 2xl:leading-[1.08]',
  '3xl:text-[4.9rem] 3xl:leading-[1.07]',
  '4xl:text-[5.5rem] 4xl:leading-[1.06]',
)

/** Hero / largest marketing headline. */
export const typeDisplay = cn(
  typeFont,
  typeWeightHeading,
  'text-balance leading-[0.92] tracking-[-0.04em]',
  'text-[2.2rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.8rem] xl:text-[4.6rem]',
  '2xl:text-[6rem] 3xl:text-[7rem] 4xl:text-[8rem]',
)

/** Editorial hero (about page viewport scale). */
export const typeDisplayEditorial = cn(
  typeFont,
  typeWeightHeading,
  'text-balance leading-[0.92] tracking-[-0.04em]',
  'text-[12vw] md:text-[8vw]',
  '2xl:text-[12rem] 2xl:leading-[1.15] 3xl:text-[15rem] 3xl:leading-[1.15] 4xl:text-[18rem] 4xl:leading-[1.15]',
)

/** Page & section titles. */
export const typeH1 = cn(
  typeFont,
  typeWeightHeading,
  'text-balance leading-[1.08] tracking-tight text-foreground',
  'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  typeUltra,
)

/** Section / article primary titles. */
export const typeH2 = cn(
  typeFont,
  typeWeightHeading,
  'text-balance leading-[1.12] tracking-tight text-foreground',
  'text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]',
)

/** Subsection / card titles. */
export const typeH3 = cn(
  typeFont,
  typeWeightHeading,
  'text-balance leading-snug tracking-tight text-foreground',
  'text-2xl sm:text-3xl md:text-4xl',
)

/** Smaller headings, TOC, sidebar titles. */
export const typeH4 = cn(
  typeFont,
  typeWeightHeading,
  'leading-snug tracking-tight text-foreground',
  'text-xl sm:text-2xl lg:text-3xl',
)

/** Intro / deck copy. */
export const typeLead = cn(
  typeFont,
  typeWeightBody,
  'text-balance leading-relaxed text-muted-foreground',
  'text-lg md:text-xl',
  '2xl:text-xl 3xl:text-2xl 4xl:text-2xl',
)

/** Default paragraph. */
export const typeBody = cn(
  typeFont,
  typeWeightBody,
  'leading-relaxed text-foreground/70',
  'text-base md:text-lg',
  '2xl:text-xl 3xl:text-2xl 4xl:text-2xl',
)

/** Compact body (articles, metadata blocks). */
export const typeBodySm = cn(
  typeFont,
  typeWeightBody,
  'text-pretty text-sm leading-relaxed text-foreground/70 sm:text-[15px] md:text-base',
)

/** Eyebrow / kicker / overline. */
export const typeLabel = cn(
  typeFont,
  typeWeightLabel,
  'text-[10px] uppercase tracking-[0.25em] text-signal',
)

export const typeLabelSm = cn(
  typeFont,
  typeWeightLabel,
  'text-xs uppercase tracking-[0.25em] text-signal',
)

export const typeLabelHero = cn(
  typeLabelSm,
  'tracking-[0.3em]',
  'mb-6 sm:mb-7 md:mb-8 lg:mb-9 xl:mb-10',
)

/** Muted overline (sign-offs, secondary meta). */
export const typeLabelMuted = cn(
  typeFont,
  typeWeightLabel,
  'text-xs uppercase tracking-[0.2em] text-muted-foreground',
)

/** Card tags, media meta chips. */
export const typeCaption = cn(
  typeFont,
  typeWeightLabel,
  'text-[10px] uppercase tracking-[0.25em] text-foreground/80',
)

export const typeMeta = cn(typeFont, typeWeightBody, 'text-xs text-muted-foreground')

/** Marquee / ticker lines. */
export const typeMarquee = cn(
  typeFont,
  typeWeightLabel,
  'text-xs uppercase tracking-[0.24em] sm:text-sm sm:tracking-[0.26em] md:text-base md:tracking-[0.28em]',
)

/** Small UI controls (pills, compact CTAs). */
export const typeUiSm = cn(
  typeFont,
  typeWeightLabel,
  'text-[10px] uppercase tracking-[0.18em]',
)

export const typeUiXs = cn(
  typeFont,
  typeWeightLabel,
  'text-[9px] uppercase tracking-[0.18em]',
)

export const typeTabular = cn(typeFont, 'tabular-nums')

/** Card / list titles at smaller sizes. */
export const typeCardTitle = cn(
  typeFont,
  typeWeightHeading,
  'text-pretty leading-[1.15] tracking-tight text-foreground',
  'text-sm font-semibold sm:text-[0.95rem] lg:text-base xl:text-[1.05rem]',
)

export const typeCardTitleLg = cn(
  typeFont,
  typeWeightHeading,
  'text-pretty leading-[1.15] tracking-tight text-foreground',
  'text-base sm:text-lg',
)

/** Footer work/about panels — large display lines. */
export const typeFooterPanelTitle = cn(
  typeFont,
  typeWeightHeading,
  'leading-[0.9] tracking-[-0.04em]',
  'text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl',
)

export const typeFooterBrand = cn(
  typeFont,
  typeWeightHeading,
  'tracking-tight',
  'text-3xl sm:text-4xl lg:text-4xl xl:text-5xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl',
)

export const typeCaptionOnDark = cn(typeCaption, 'text-white/55')

export const typeLabelOnDark = cn(typeLabel, 'text-white/55')

/** Contact page hero — between display and h1. */
export const typeContactHero = cn(
  typeFont,
  typeWeightHeading,
  'text-balance leading-[1.02] tracking-[-0.03em] text-foreground',
  'text-[2.65rem] sm:text-5xl md:text-[3.25rem] lg:text-7xl xl:text-[5.25rem]',
  typeUltra,
)
