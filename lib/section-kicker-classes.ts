import { typeLabel, typeLabelSm } from '@/lib/type-scale'

/**
 * Shared responsive type scale for section kickers (“Our work”, “Our insights”, …).
 * Light mode: second accent (`--secondary`); dark mode: accent yellow (`--accent`).
 */
export const sectionKickerTextClass =
  'text-sm font-medium text-secondary dark:text-accent sm:text-[15px] lg:text-base xl:text-lg 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl'

/**
 * Same ink as kickers — bullets, middots, and inline bits next to a kicker line.
 */
export const sectionKickerAccentClass = 'text-secondary dark:text-accent'

/**
 * Page eyebrow — brand green dot + signal label.
 */
export const pageEyebrowRowClass = 'flex items-center gap-2'

export const pageEyebrowDotClass = 'size-1.5 shrink-0 rounded-full bg-primary'

export const pageEyebrowTextClass = typeLabel

/** Larger page eyebrows (contact hero, etc.). */
export const pageEyebrowTextLgClass = typeLabelSm
