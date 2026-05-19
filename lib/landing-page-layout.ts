import { containerMaxWidthClass, containerPaddingClass } from '@/components/layout/container'
import { cn } from '@/lib/utils'

/**
 * Horizontal gutters for home page bands and nav.
 * From `2xl` up, matches `containerPaddingClass` on `/insights` (px-20 / 28 / 32).
 */
export const landingPageGutterClass = cn(
  'px-4 sm:px-5 md:px-7 lg:px-9 xl:px-10',
  '2xl:px-20 3xl:px-28 4xl:px-32',
)

/**
 * Content rail — capped below `2xl`; from `2xl` up matches insights `Container` (full width).
 */
export const landingPageContentMaxClass = cn(
  'mx-auto w-full min-w-0',
  'max-w-[1400px] xl:max-w-[1400px]',
  '2xl:max-w-none',
)

/**
 * Single shell matching insights page `Container` (use when one wrapper is enough).
 */
export const landingPageShellClass = cn(containerMaxWidthClass, containerPaddingClass)

/** Inner rail used inside a `landingPageGutterClass` section (manifesto, lab, hero, …). */
export const landingSectionInnerClass = cn('relative mx-auto min-w-0', landingPageContentMaxClass)

/** First content row below sticky nav — work / insights filter bars, services hero. */
export const catalogPageBelowNavPadTopClass = 'pt-6 sm:pt-8 md:pt-10 lg:pt-11'

export const catalogPageFilterBarPadClass = 'py-6 sm:py-8 md:py-10 lg:py-11'

/** Hero-only top inset to clear the sticky nav (`-mt-14` on the section). */
export const landingHeroPadTopClass = cn(
  'pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-44',
  '2xl:pt-48 3xl:pt-52 4xl:pt-56',
)

/** Home hero — extra clearance below sticky nav at 2xl+. */
export const landingHomeHeroPadTopClass = cn(
  'pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-44',
  '2xl:pt-56 3xl:pt-64 4xl:pt-72',
)

/** Equal space between home page sections (use on `main`; do not pair with per-section `py`). */
export const landingHomeStackGapClass = cn(
  'flex flex-col gap-16 md:gap-20 lg:gap-24 xl:gap-28',
  '2xl:gap-32 3xl:gap-36 4xl:gap-40',
)

/** Pull footer up on home — offsets part of `landingHomeStackGapClass` after the insights band. */
export const landingHomeFooterTightClass = cn(
  '-mt-10 md:-mt-14 lg:-mt-18 xl:-mt-20',
  '2xl:-mt-24 3xl:-mt-28 4xl:-mt-32',
)

/** Uniform vertical padding inside a band (contact, insight related, etc.). */
export const landingSectionYClass = cn(
  'pt-10 pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14 xl:pt-16 xl:pb-16',
  '2xl:pt-20 2xl:pb-20 3xl:pt-24 3xl:pb-24 4xl:pt-28 4xl:pb-28',
)

export const landingSectionPadTopClass = cn(
  'pt-10 md:pt-12 lg:pt-14 xl:pt-16',
  '2xl:pt-20 3xl:pt-24 4xl:pt-28',
)

export const landingSectionPadBottomClass = cn(
  'pb-10 md:pb-12 lg:pb-14 xl:pb-16',
  '2xl:pb-20 3xl:pb-24 4xl:pb-28',
)

/**
 * Insights strip: bleed only to the right (past section gutter) so the carousel
 * can scroll off-screen. Left edge stays aligned with section headings at all breakpoints.
 */
export const landingStripBleedClass = cn(
  '-mr-8 sm:-mr-10 md:-mr-12 lg:-mr-14 xl:-mr-16',
  '2xl:-mr-20 3xl:-mr-28 4xl:-mr-32',
)
