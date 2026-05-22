import { cn } from '@/lib/utils'

/** Centered login route wrapper padding. */
export const adminLoginShellPaddingClass = cn(
  'px-6 py-12 sm:px-8 md:px-10 lg:px-14 xl:px-16',
  '2xl:px-20 3xl:px-24 4xl:px-28',
)

/** Logged-in admin shell root — no overflow here (would break sidebar `position: sticky`). */
export const adminShellRootClass = cn('min-h-dvh min-w-0 w-full max-w-full')

/** Outer padding for logged-in admin shell — moderate at lg+ so sidebar + main fit without horizontal scroll. */
export const adminShellPaddingClass = cn(
  'min-w-0 w-full max-w-full',
  'px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9',
  'lg:px-8 lg:py-9 xl:px-10 xl:py-10',
  '2xl:px-12 2xl:py-10 3xl:px-14 3xl:py-11 4xl:px-16 4xl:py-12',
)

/**
 * Sidebar + main: from `xl` up, sidebar stays one width so extra viewport width goes to the main column (full stretch).
 */
export const adminMainGridClass = cn(
  'grid w-full max-w-full min-w-0 grid-cols-1 items-start',
  'gap-6 sm:gap-7 lg:gap-8 xl:gap-10 2xl:gap-10',
  'lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]',
  'xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]',
  '2xl:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]',
)

/** One accordion group in the admin sidebar. */
export const adminSidebarAccordionItemClass = cn(
  'overflow-hidden rounded-xl border-0 border-b-0 bg-white/[0.03]',
)

/** Accordion group labels in admin sidebar. */
export const adminSidebarAccordionTriggerClass = cn(
  'items-center rounded-xl px-3 py-2.5 font-semibold tracking-[0.14em] transition-[color,background-color] duration-200',
  'text-[11px] sm:text-xs lg:text-xs xl:text-xs',
  'text-white/60 uppercase',
  'hover:no-underline hover:bg-white/5 data-[state=open]:bg-white/5',
  'focus-visible:ring-2 focus-visible:ring-white/15 focus-visible:outline-none',
)

/** File inputs in admin forms — full width, aligned with text fields (h-9). */
export const adminFileInputClass = cn(
  'h-9 w-full cursor-pointer border-white/15 bg-background/30 text-sm text-white',
  'file:mr-3 file:inline-flex file:h-7 file:rounded-md file:border-0 file:bg-white/15 file:px-3 file:text-sm file:text-white',
)

/** Base nav link row (active state merged in component). */
export const adminSidebarNavLinkBaseClass = cn(
  'group relative block min-w-0 truncate rounded-xl px-3 py-2 font-medium transition-colors',
  'text-sm lg:text-sm xl:text-[15px]',
)

/**
 * Sticky desktop sidebar — must not sit under an ancestor with overflow-x hidden (breaks sticky).
 * Max height keeps nav scrollable inside the panel while the aside stays fixed in view.
 */
export const adminSidebarAsideClass = cn(
  'hidden w-full min-w-0 max-w-full shrink-0 self-start lg:block',
  'lg:sticky lg:top-8 lg:z-20 lg:max-h-[calc(100dvh-4rem)]',
)

/** Sidebar panel surface — tighter padding than main content panels. */
export const adminSidebarPanelClass = cn(
  'flex h-full max-h-[inherit] min-h-0 min-w-0 max-w-full flex-col rounded-2xl border border-white/10 bg-[#1A1A1B]',
  'p-4 sm:p-4 lg:p-5',
)

/** Bordered panels (tables, list shells). */
export const adminPanelSurfaceClass = cn(
  'w-full min-w-0 max-w-full rounded-2xl border border-white/10 bg-[#1A1A1B]',
  'p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 2xl:p-7 3xl:p-8 4xl:p-8',
)

/** Table header cells: readable on large screens without jumping awkwardly. */
export const adminTableHeadClass =
  'text-xs text-white/70 sm:text-sm lg:text-[15px] xl:text-base 2xl:text-base 3xl:text-lg 4xl:text-lg'

/** Title links in admin tables — cap width on smaller screens; full column width on 2xl+ so rows use the stretched layout. */
export const adminTableTitleLinkClass = cn(
  'block min-w-0 truncate text-white hover:underline',
  'max-w-56 sm:max-w-88 md:max-w-md lg:max-w-136 xl:max-w-xl',
  '2xl:w-full 2xl:max-w-none',
)
