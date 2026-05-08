'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Flat circular controls — enabled: mid charcoal + white arrow; disabled: near-bg + muted arrow. */
const circle =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full sm:size-12'

const bgOn = 'bg-card'
const bgOff = 'bg-muted'
const iconOn = 'text-card-foreground'
const iconOff = 'text-muted-foreground'

type CircleNavButtonProps = {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
  label: string
}

function CircleNavButton({ direction, disabled, onClick, label }: CircleNavButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        circle,
        disabled ? bgOff : bgOn,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none',
      )}
    >
      <Icon
        className={cn('size-5 sm:size-[1.35rem]', disabled ? iconOff : iconOn)}
        strokeWidth={1.5}
        aria-hidden
      />
    </button>
  )
}

export type CircleArrowPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  /** When true, nav is not shown if `totalPages` ≤ 1 */
  hideWhenSinglePage?: boolean
}

export function CircleArrowPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  hideWhenSinglePage = true,
}: CircleArrowPaginationProps) {
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  if (hideWhenSinglePage && totalPages <= 1) {
    return null
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('inline-flex items-center gap-2.5 sm:gap-3', className)}
    >
      <CircleNavButton
        direction="prev"
        disabled={!canPrev}
        label="Previous page"
        onClick={() => canPrev && onPageChange(currentPage - 1)}
      />
      <CircleNavButton
        direction="next"
        disabled={!canNext}
        label="Next page"
        onClick={() => canNext && onPageChange(currentPage + 1)}
      />
    </nav>
  )
}
