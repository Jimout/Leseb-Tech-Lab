'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import {
  landingStripDotActiveClass,
  landingStripDotInactiveClass,
  landingStripNavButtonClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export type StripPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  hideWhenSinglePage?: boolean
}

/**
 * Minimal dot + arrow pagination for horizontal card strips.
 */
export function StripPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  hideWhenSinglePage = true,
}: StripPaginationProps) {
  if (hideWhenSinglePage && totalPages <= 1) return null

  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <nav
      role="navigation"
      aria-label="Carousel pagination"
      className={cn('flex items-center justify-center gap-4 sm:gap-5', className)}
    >
      <button
        type="button"
        aria-label="Previous"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        className={landingStripNavButtonClass}
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const n = i + 1
          const active = n === currentPage
          return (
            <button
              key={n}
              type="button"
              aria-label={`Go to slide ${n}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => onPageChange(n)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                active ? landingStripDotActiveClass : landingStripDotInactiveClass,
              )}
            />
          )
        })}
      </div>

      <button
        type="button"
        aria-label="Next"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(currentPage + 1)}
        className={landingStripNavButtonClass}
      >
        <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
    </nav>
  )
}
