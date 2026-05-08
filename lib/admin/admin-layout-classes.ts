import { cn } from '@/lib/utils'

/** Centered login route wrapper padding. */
export const adminLoginShellPaddingClass = cn(
  'px-6 py-12 sm:px-8 md:px-10 lg:px-14 xl:px-16',
  '2xl:px-20 3xl:px-24 4xl:px-28',
)

/** Outer padding for logged-in admin shell — horizontal growth stays moderate so main column can stretch on ultra-wide. */
export const adminShellPaddingClass = cn(
  'px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-9',
  'lg:px-14 lg:py-9 xl:px-16 xl:py-10',
  '2xl:px-20 2xl:py-10 3xl:px-22 3xl:py-11 4xl:px-24 4xl:py-12',
)

/**
 * Sidebar + main: from `xl` up, sidebar stays one width so extra viewport width goes to the main column (full stretch).
 */
export const adminMainGridClass = cn(
  'grid w-full max-w-none min-w-0 grid-cols-1 items-start',
  'gap-7 sm:gap-8 lg:gap-10 xl:gap-12 2xl:gap-12 3xl:gap-12 4xl:gap-14',
  '2xl:items-stretch 3xl:items-stretch 4xl:items-stretch',
  'lg:grid-cols-[17rem_minmax(0,1fr)]',
  'xl:grid-cols-[18rem_minmax(0,1fr)]',
  '2xl:grid-cols-[18rem_minmax(0,1fr)]',
  '3xl:grid-cols-[18rem_minmax(0,1fr)]',
  '4xl:grid-cols-[18rem_minmax(0,1fr)]',
)

/** Accordion group labels in admin sidebar. */
export const adminSidebarAccordionTriggerClass = cn(
  'items-center rounded-xl px-3 py-2 font-semibold tracking-[0.14em] transition-colors duration-200',
  'text-[11px] sm:text-xs md:text-[12px] lg:text-[13px] xl:text-sm',
  '2xl:text-sm 3xl:text-base 4xl:text-base',
  'text-white/60 uppercase',
  'hover:no-underline hover:bg-white/5 data-[state=open]:bg-white/5',
  'focus-visible:ring-2 focus-visible:ring-white/15 focus-visible:outline-none',
)

/** Base nav link row (active state merged in component). */
export const adminSidebarNavLinkBaseClass = cn(
  'group relative rounded-xl px-3 py-2 font-medium transition-colors',
  'text-sm lg:text-[15px] xl:text-base 2xl:text-base 3xl:text-lg 4xl:text-lg',
)

/**
 * Sticky desktop sidebar: height follows accordion + nav (no fixed max-height — avoids inner scroll when sections expand).
 * `items-start` on the parent grid keeps this column from stretching to match the main column.
 */
export const adminSidebarAsideClass = cn(
  'sticky top-8 hidden w-full min-w-0 shrink-0 lg:block',
  'self-start',
  '2xl:self-stretch 3xl:self-stretch 4xl:self-stretch',
  '2xl:h-full 3xl:h-full 4xl:h-full',
)

/** Bordered panels (tables, list shells). */
export const adminPanelSurfaceClass = cn(
  'w-full min-w-0 rounded-2xl border border-white/10 bg-[#1A1A1B]',
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
