'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getPaginationItems, type PaginationItem } from '@/lib/pagination-items'
import { cn } from '@/lib/utils'

/** Use dots only when the page count stays scannable. */
const DOT_MODE_MAX_PAGES = 5

export type SitePaginationProps = {
  currentPage?: number
  /** Alias for `currentPage` (admin tables). */
  page?: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  disabled?: boolean
  hidePrev?: boolean
  hideNext?: boolean
  hideWhenSinglePage?: boolean
  /** Always show page numbers (catalog grids); default uses dots when ≤5 pages. */
  numbered?: boolean
}

const paginationTrackClass = cn(
  'inline-flex max-w-full items-center gap-1 rounded-full border border-foreground/12',
  'bg-foreground/[0.05] px-1.5 py-1 backdrop-blur-md',
  'shadow-[0_10px_36px_-14px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)]',
  'sm:gap-1.5 sm:px-2 sm:py-1.5',
)

const paginationArrowClass = cn(
  'inline-flex size-8 shrink-0 items-center justify-center rounded-full sm:size-9',
  'border border-transparent text-foreground/75 transition-all duration-300',
  'hover:border-signal/40 hover:bg-signal/15 hover:text-signal',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-30',
  'motion-reduce:transition-none',
)

const paginationPageClass = cn(
  'inline-flex min-h-8 min-w-8 items-center justify-center rounded-full px-1.5',
  'font-sans text-xs font-semibold tabular-nums text-foreground/55 transition-all duration-300 sm:text-sm',
  'hover:bg-signal/12 hover:text-signal',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

const paginationPageActiveClass = cn(
  'border border-signal/55 bg-signal text-secondary-foreground',
  'shadow-[0_0_22px_-4px_color-mix(in_srgb,var(--secondary)_65%,transparent)]',
  'hover:bg-signal hover:text-secondary-foreground',
)

const paginationEllipsisClass =
  'flex min-h-8 min-w-6 items-center justify-center px-0.5 text-xs font-semibold text-foreground/35 select-none'

const paginationDotInactiveClass =
  'h-2 w-2 rounded-full bg-foreground/25 transition-all duration-300 hover:bg-signal/45'

const paginationDotActiveClass = cn(
  'h-2 w-7 rounded-full bg-signal',
  'shadow-[0_0_14px_-2px_color-mix(in_srgb,var(--secondary)_70%,transparent)]',
)

function PaginationArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous page' : 'Next page'}
      onClick={onClick}
      className={paginationArrowClass}
    >
      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
    </button>
  )
}

function PaginationPageList({
  items,
  currentPage,
  disabled,
  onPageChange,
}: {
  items: PaginationItem[]
  currentPage: number
  disabled: boolean
  onPageChange: (page: number) => void
}) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <li key={`ellipsis-${idx}`} className={paginationEllipsisClass} aria-hidden>
            …
          </li>
        ) : (
          <li key={item}>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                paginationPageClass,
                item === currentPage && paginationPageActiveClass,
              )}
            >
              {item}
            </button>
          </li>
        ),
      )}
    </ol>
  )
}

function PaginationDots({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}) {
  return (
    <div
      className="flex items-center gap-2 px-1"
      aria-label={`Page ${currentPage} of ${totalPages}`}
    >
      {Array.from({ length: totalPages }, (_, i) => {
        const n = i + 1
        const active = n === currentPage
        return (
          <button
            key={n}
            type="button"
            aria-label={`Page ${n}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => onPageChange(n)}
            className={cn(
              'rounded-full transition-all duration-300 motion-reduce:transition-none',
              active ? paginationDotActiveClass : paginationDotInactiveClass,
            )}
          />
        )
      })}
    </div>
  )
}

/** Site-wide pagination — lemon active state, compact ellipsis window for many pages. */
export function SitePagination({
  currentPage: currentPageProp,
  page,
  totalPages,
  onPageChange,
  className,
  disabled = false,
  hidePrev = false,
  hideNext = false,
  hideWhenSinglePage = true,
  numbered = false,
}: SitePaginationProps) {
  const currentPage = currentPageProp ?? page ?? 1
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages
  const useDots = !numbered && totalPages <= DOT_MODE_MAX_PAGES
  const items = useDots ? null : getPaginationItems(currentPage, totalPages)

  if (hideWhenSinglePage && totalPages <= 1) {
    return null
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex w-full justify-center', className)}
    >
      <div className={paginationTrackClass}>
        {!hidePrev && (
          <PaginationArrow
            direction="prev"
            disabled={disabled || !canPrev}
            onClick={() => canPrev && onPageChange(currentPage - 1)}
          />
        )}

        {useDots ? (
          <PaginationDots
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ) : (
          <PaginationPageList
            items={items!}
            currentPage={currentPage}
            disabled={disabled}
            onPageChange={onPageChange}
          />
        )}

        {!hideNext && (
          <PaginationArrow
            direction="next"
            disabled={disabled || !canNext}
            onClick={() => canNext && onPageChange(currentPage + 1)}
          />
        )}
      </div>
    </nav>
  )
}
