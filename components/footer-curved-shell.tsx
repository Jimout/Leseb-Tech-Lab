import * as React from 'react'

import { cn } from '@/lib/utils'

type FooterCurvedShellProps = {
  rail: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** Quarter-circle patch for mobile junctions (reference: 100×100 path, page fill). */
function MobileQuarterPatch({ className }: { className?: string }) {
  return (
    <svg
      className={cn('pointer-events-none absolute fill-background lg:hidden', className)}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <path d="M51.9 0v1.9c-27.6 0-50 22.4-50 50H0V0h51.9z" />
    </svg>
  )
}

/**
 * Inner surface uses theme `box` (→ `--card`). Social rail + curve patches use `background`
 * so the strip reads slightly darker than the panel in dark mode (similar to the old rail blend).
 */
export function FooterCurvedShell({ rail, children, className }: FooterCurvedShellProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-box pt-2 pb-2 sm:pb-2',
          'lg:rounded-tr-3xl lg:rounded-b-3xl lg:pb-2 lg:pt-3',
        )}
      >
        <div
          className={cn(
            'absolute left-0 top-0 z-30 w-[3.85rem] pb-5 pr-4 sm:w-[4.15rem] sm:pr-5',
            'bg-background',
          )}
        >
          <div className="absolute left-0 top-0 z-20 w-full translate-x-full bg-background" aria-hidden>
            <div className="aspect-square w-full rounded-tl-2xl bg-box lg:rounded-tl-3xl" />
          </div>
          <div className="absolute bottom-0 right-0 z-20 w-full bg-box" aria-hidden>
            <div className="aspect-square w-full rounded-br-2xl bg-background lg:rounded-br-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 z-20 w-full translate-y-full bg-background" aria-hidden>
            <div className="aspect-square w-full rounded-tl-2xl bg-box lg:rounded-tl-3xl" />
          </div>

          <MobileQuarterPatch className="left-px top-full z-40 -translate-x-full -translate-y-px rotate-180" />
          <MobileQuarterPatch className="-right-px top-px z-40 -translate-y-full rotate-180" />

          <div className="relative z-20 flex flex-col items-center gap-2 px-1.5 py-7 sm:gap-2 sm:px-2 sm:py-8">
            {rail}
          </div>
        </div>

        <div
          className={cn(
            'relative z-10',
            // Keep content gutter symmetric: offset only by the social rail width.
            'ml-[3.85rem] px-4 pb-1 pt-10 sm:ml-[4.15rem] sm:px-5 sm:pb-2 sm:pt-12 md:px-8 md:pt-14',
            'lg:px-16 lg:pb-2 lg:pt-14 xl:px-18 xl:pb-3 xl:pt-16',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
