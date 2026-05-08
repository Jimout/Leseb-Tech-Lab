'use client'

import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { useSiteSettings } from '@/hooks/use-site-settings'
import { cn } from '@/lib/utils'

const UNITS_PER_STRIP = 8
const ROW_GAP_CLASS = 'gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4'

const marqueeIconSize = 'size-6 sm:size-6 md:size-7 lg:size-8 xl:size-9'

/** Opacity-only swap — no scale morph. */
const marqueeIconMotion = cn(marqueeIconSize, 'transition-opacity duration-0 motion-reduce:transition-none')

function MarqueeArrowButton() {
  return (
    <button
      type="button"
      className={cn(
        'marquee-icon-btn group/icon relative inline-flex shrink-0 items-center justify-center rounded-full',
        'bg-secondary text-secondary-foreground',
        'dark:bg-accent dark:text-accent-foreground',
        'size-12 sm:size-14 md:size-16 lg:size-18 xl:size-20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      aria-label="Pause scrolling; arrow points right while hovered"
    >
      <ArrowUpRight
        className={cn(
          marqueeIconMotion,
          'opacity-100 group-hover/icon:opacity-0 group-focus-visible/icon:opacity-0',
        )}
        strokeWidth={2}
        aria-hidden
      />
      <ArrowRight
        className={cn(
          marqueeIconMotion,
          'absolute opacity-0 group-hover/icon:opacity-100 group-focus-visible/icon:opacity-100',
        )}
        strokeWidth={2}
        aria-hidden
      />
    </button>
  )
}

function MarqueeUnits({ keyPrefix, label }: { keyPrefix: string; label: string }) {
  return Array.from({ length: UNITS_PER_STRIP }, (_, i) => (
    <div
      key={`${keyPrefix}-${i}`}
      className="flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5"
    >
      <span
        className={cn(
          'inline-block whitespace-nowrap py-1.5 text-5xl font-semibold leading-tight tracking-tight text-foreground',
          'sm:py-2 sm:text-6xl md:py-2.5 md:text-7xl lg:py-3 lg:text-8xl xl:text-9xl 2xl:text-[10rem] 3xl:text-[11rem] 4xl:text-[12rem]',
        )}
      >
        {label}
      </span>
      <MarqueeArrowButton />
    </div>
  ))
}

function MarqueeStrip({
  direction,
  durationSec,
  segmentId,
  label,
}: {
  direction: 'left' | 'right'
  durationSec: number
  segmentId: string
  label: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden py-1 sm:py-1.5 md:py-2 lg:py-2.5 xl:py-3',
        'has-[.marquee-icon-btn:hover]:[&_.marquee-track]:paused',
        'has-[.marquee-icon-btn:focus-visible]:[&_.marquee-track]:paused',
      )}
    >
      <div
        className={cn(
          'marquee-track flex w-max',
          direction === 'left' ? 'animate-marquee-strip-left' : 'animate-marquee-strip-right',
        )}
        style={{ '--marquee-duration': `${durationSec}s` } as CSSProperties}
      >
        <div className={cn('flex shrink-0 items-center', ROW_GAP_CLASS)}>
          <MarqueeUnits keyPrefix={`${segmentId}-a`} label={label} />
        </div>
        <div className={cn('flex shrink-0 items-center', ROW_GAP_CLASS)} aria-hidden>
          <MarqueeUnits keyPrefix={`${segmentId}-b`} label={label} />
        </div>
      </div>
    </div>
  )
}

export type DualMarqueeCtaProps = {
  /** Phrase before each accent icon (include punctuation if desired) */
  label?: string
  /** One full loop duration in seconds (both rows) */
  durationSec?: number
  className?: string
}

export function DualMarqueeCta({
  label,
  durationSec,
  className,
}: DualMarqueeCtaProps) {
  const { settings } = useSiteSettings()
  const defaults = settings.dualMarquee
  return (
    <section
      className={cn(
        'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen min-w-0 overflow-x-hidden bg-transparent font-sans',
        className,
      )}
    >
      <div className="relative z-10 flex flex-col gap-0 pt-2 sm:pt-2 md:pt-2.5 lg:pt-3 xl:pt-4 2xl:pt-5 3xl:pt-6 4xl:pt-7 pb-1 sm:pb-1.5 md:pb-2 lg:pb-2.5 xl:pb-3 2xl:pb-3.5 3xl:pb-4 4xl:pb-5">
        <div>
          <MarqueeStrip
            direction="left"
            durationSec={durationSec ?? defaults.durationSec}
            segmentId="top"
            label={label ?? defaults.label}
          />
        </div>
        <div className="-mt-8 sm:-mt-10 md:-mt-12 lg:-mt-14 xl:-mt-16 2xl:-mt-18 3xl:-mt-20 4xl:-mt-24">
          <MarqueeStrip
            direction="right"
            durationSec={durationSec ?? defaults.durationSec}
            segmentId="bottom"
            label={label ?? defaults.label}
          />
        </div>
      </div>
    </section>
  )
}
