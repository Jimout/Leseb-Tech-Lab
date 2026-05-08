import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type PillPaginationItem = number | 'ellipsis'

/** Compact list: when totalPages > 4 and you’re on pages 1–3 → 1, 2, 3, …, last (before next arrow). */
export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PillPaginationItem[] {
  if (totalPages < 1) return [1]
  if (totalPages === 1) return [1]
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const cp = Math.min(Math.max(1, currentPage), totalPages)

  if (cp <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages]
  }
  if (cp >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, 'ellipsis', cp - 1, cp, cp + 1, 'ellipsis', totalPages]
}

/** Reference: dark charcoal pill (#1A1A1C), active dot (#2D2D30), white bold type */
const pillTrack =
  'inline-flex items-center gap-2 rounded-full border-0 bg-[#1A1A1C] px-3.5 py-1.5 shadow-none sm:gap-2.5 sm:px-4 sm:py-1.5'

const arrowBtn = cn(
  'inline-flex shrink-0 items-center justify-center rounded-full text-white transition-opacity',
  'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1C]',
  'disabled:pointer-events-none disabled:opacity-35',
  'motion-reduce:transition-none',
)

const pageNumberBase =
  'min-h-7 min-w-7 px-0.5 font-sans text-xs font-bold tabular-nums text-white transition-opacity sm:text-sm'

const pageInactive = cn(
  pageNumberBase,
  'rounded-full hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1C]',
)

const pageActive = cn(
  'inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[#2D2D30] font-sans text-xs font-bold tabular-nums text-white sm:text-sm',
)

const ellipsisClass =
  'flex min-h-7 min-w-6 items-center justify-center px-0.5 font-sans text-xs font-bold text-white sm:text-sm'

function PillPaginationPageItem({
  item,
  currentPage,
  disabled,
  onPageChange,
}: {
  item: PillPaginationItem
  currentPage: number
  disabled: boolean
  onPageChange: (page: number) => void
}) {
  if (item === 'ellipsis') {
    return (
      <li className={ellipsisClass} aria-hidden>
        ...
      </li>
    )
  }
  const active = item === currentPage
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Page ${item}`}
        aria-current={active ? 'page' : undefined}
        onClick={() => onPageChange(item)}
        className={cn(active ? pageActive : pageInactive, 'focus-visible:outline-none')}
      >
        {item}
      </button>
    </li>
  )
}

function PillPaginationPageList({
  items,
  currentPage,
  disabled,
  onPageChange,
}: {
  items: PillPaginationItem[]
  currentPage: number
  disabled: boolean
  onPageChange: (page: number) => void
}) {
  return (
    <ul className="flex items-center gap-2 sm:gap-2.5">
      {items.map((item, idx) => (
        <PillPaginationPageItem
          key={item === 'ellipsis' ? `e-${idx}` : item}
          item={item}
          currentPage={currentPage}
          disabled={disabled}
          onPageChange={onPageChange}
        />
      ))}
    </ul>
  )
}

function PillPaginationArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous page' : 'Next page'}
      onClick={onClick}
      className={arrowBtn}
    >
      <Icon className="size-3.5" strokeWidth={1.15} aria-hidden />
    </button>
  )
}

type PillPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  disabled?: boolean
  hidePrev?: boolean
  hideNext?: boolean
  hideWhenSinglePage?: boolean
}

function PillPaginationInner({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
  hidePrev,
  hideNext,
  items,
  canPrev,
  canNext,
}: Omit<PillPaginationProps, 'className' | 'hideWhenSinglePage'> & {
  items: PillPaginationItem[]
  canPrev: boolean
  canNext: boolean
}) {
  return (
    <div className={pillTrack}>
      {!hidePrev && totalPages > 1 && (
        <PillPaginationArrow
          direction="prev"
          disabled={disabled || !canPrev}
          onClick={() => canPrev && onPageChange(currentPage - 1)}
        />
      )}

      <PillPaginationPageList
        items={items}
        currentPage={currentPage}
        disabled={disabled ?? false}
        onPageChange={onPageChange}
      />

      {!hideNext && totalPages > 1 && (
        <PillPaginationArrow
          direction="next"
          disabled={disabled || !canNext}
          onClick={() => canNext && onPageChange(currentPage + 1)}
        />
      )}
    </div>
  )
}

export function PillPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  disabled = false,
  hidePrev = false,
  hideNext = false,
  hideWhenSinglePage = false,
}: PillPaginationProps) {
  const items = getPaginationItems(currentPage, totalPages)
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  if (hideWhenSinglePage && totalPages <= 1) {
    return null
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('inline-flex max-w-full justify-center', className)}
    >
      <PillPaginationInner
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={disabled}
        hidePrev={hidePrev}
        hideNext={hideNext}
        items={items}
        canPrev={canPrev}
        canNext={canNext}
      />
    </nav>
  )
}
