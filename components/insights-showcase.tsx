'use client'

import * as React from 'react'

import { CircleArrowPagination } from '@/components/circle-arrow-pagination'
import { FluidSplitButton } from '@/components/fluid-split-button'
import { InsightCard } from '@/components/insight-card'
import { useHorizontalStripWheelCallback } from '@/hooks/use-horizontal-strip-wheel'
import { useInsightsShowcaseMerged } from '@/hooks/use-insights-showcase-merged'
import { sectionKickerTextClass } from '@/lib/section-kicker-classes'
import { cn } from '@/lib/utils'

function useInsightScroller(itemCount: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, itemCount)

  const goToPage = React.useCallback(
    (p: number) => {
      const el = ref.current
      if (!el) return
      const clamped = Math.min(Math.max(1, p), totalPages)
      const child = el.children[clamped - 1] as HTMLElement | undefined
      child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      setPage(clamped)
    },
    [totalPages],
  )

  return { ref, page, totalPages, goToPage }
}

const showcaseH2Class =
  'mt-4 text-balance text-[1.6875rem] font-semibold leading-[1.14] tracking-tight text-foreground sm:mt-5 sm:text-[1.9375rem] sm:leading-[1.13] md:mt-6 md:leading-[1.12] lg:mt-7 lg:text-[2.5rem] lg:leading-[1.11] xl:mt-6 xl:text-[3rem] xl:leading-[1.1] 2xl:mt-12 2xl:text-[4.25rem] 2xl:leading-[1.08] 3xl:mt-16 3xl:text-[4.9rem] 3xl:leading-[1.07] 4xl:mt-20 4xl:text-[5.5rem] 4xl:leading-[1.06]'

function ShowcaseHeading({ variant }: { variant: 'default' | 'related' }) {
  return (
    <header className="w-full max-w-none">
      <p className={cn('flex items-center gap-2', sectionKickerTextClass)}>
        <span className="size-1.5 shrink-0 rounded-full bg-secondary dark:bg-accent" aria-hidden />
        My Insights
      </p>
      {variant === 'related' ? (
        <h2 id="insight-related-heading" className={showcaseH2Class}>
          <span className="block">You might also</span>
          <span className="block">like</span>
        </h2>
      ) : (
        <h2 className={showcaseH2Class}>
          <span className="block">Inside my way of</span>
          <span className="block">thinking about design</span>
        </h2>
      )}
    </header>
  )
}

function useShowcaseItems(excludeIds: readonly string[] | undefined) {
  const merged = useInsightsShowcaseMerged()
  return React.useMemo(() => {
    if (!excludeIds?.length) return merged
    const omit = new Set(excludeIds)
    return merged.filter((i) => !omit.has(i.id))
  }, [excludeIds, merged])
}

function PaginationNav({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  className?: string
}) {
  return (
    <CircleArrowPagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      hideWhenSinglePage
      className={className}
    />
  )
}

export type InsightsShowcaseProps = {
  /** `related`: “You might also like” heading for article footers */
  variant?: 'default' | 'related'
  /** Hide these insight ids from the strip (e.g. current article slug) */
  excludeIds?: readonly string[]
  /** Max cards in the horizontal strip below `lg` (home only). Desktop unchanged. */
  mobileCardLimit?: number
}

function useInsightsDragScroll() {
  const dragRef = React.useRef<{
    active: boolean
    pointerId: number | null
    startX: number
    startScrollLeft: number
    moved: boolean
    suppressClickUntil: number
    el: HTMLDivElement | null
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    suppressClickUntil: 0,
    el: null,
  })

  const endDrag = React.useCallback(() => {
    const d = dragRef.current
    if (d.moved) d.suppressClickUntil = Date.now() + 150
    d.active = false
    d.pointerId = null
    d.moved = false
    d.el = null
  }, [])

  const onPointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
      suppressClickUntil: dragRef.current.suppressClickUntil,
      el,
    }
    e.preventDefault()
  }, [])

  const onPointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active || !d.el || d.pointerId !== e.pointerId) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 3) d.moved = true
    d.el.scrollLeft = d.startScrollLeft - dx
  }, [])

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current
      if (d.pointerId !== e.pointerId) return
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
      endDrag()
    },
    [endDrag],
  )

  const onPointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current
      if (d.pointerId !== e.pointerId) return
      endDrag()
    },
    [endDrag],
  )

  const onClickCapture = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (Date.now() < d.suppressClickUntil) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onClickCapture }
}

const insightStripClass = cn(
  'flex min-w-0 w-full gap-5 overflow-x-auto px-4 pb-2 sm:px-6',
  'snap-x snap-proximity lg:px-0',
  '[overflow-anchor:none]',
  'overscroll-x-contain [touch-action:pan-x_pan-y]',
  'select-none cursor-grab active:cursor-grabbing',
  '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
)

const insightCardWidthClass =
  'w-[calc((100%-2.5rem)/2.5)] 2xl:w-[calc((100%-2.5rem)/2.3)] 3xl:w-[calc((100%-2.5rem)/2.15)] 4xl:w-[calc((100%-2.5rem)/2)] max-w-none shrink-0 snap-start'

/** Home mobile: two cards fill the strip with a clear gap (no peek carousel). */
const insightMobileTwoUpStripClass = cn(
  'flex min-h-0 min-w-0 w-full items-stretch gap-6 overflow-x-auto sm:gap-8',
  'px-0 pb-2 sm:px-2',
  '[overflow-anchor:none]',
  'overscroll-x-contain [touch-action:pan-x_pan-y]',
)

const insightMobileTwoUpCardClass =
  'min-h-0 min-w-0 max-w-none flex-1 basis-0 snap-start'

export function InsightsShowcase({
  variant = 'default',
  excludeIds,
  mobileCardLimit,
}: InsightsShowcaseProps = {}) {
  const mobileStripWheelRef = useHorizontalStripWheelCallback<HTMLDivElement>()
  const desktopStripWheelRef = useHorizontalStripWheelCallback<HTMLDivElement>()
  const dragScroll = useInsightsDragScroll()
  const items = useShowcaseItems(excludeIds)
  const n = items.length
  const cappedLen =
    mobileCardLimit != null ? Math.min(Math.max(1, mobileCardLimit), n) : n
  const splitMobileDesktop = mobileCardLimit != null && cappedLen < n

  const mobileScroller = useInsightScroller(splitMobileDesktop ? cappedLen : n)
  const desktopScroller = useInsightScroller(n)

  if (n === 0) return null

  const mobileSlice = splitMobileDesktop ? items.slice(0, cappedLen) : items
  const mobileTwoUp = splitMobileDesktop && cappedLen === 2
  const mobileCardClass = mobileTwoUp ? insightMobileTwoUpCardClass : insightCardWidthClass
  const mobileStrip = (
    <>
      {mobileSlice.map((item, i) => (
        <InsightCard
          key={item.id}
          {...item}
          priority={i === 0}
          className={mobileCardClass}
          requireDoubleClick={variant === 'default'}
        />
      ))}
    </>
  )
  const desktopStrip = (
    <>
      {items.map((item, i) => (
        <InsightCard
          key={item.id}
          {...item}
          priority={i === 0}
          className={insightCardWidthClass}
          requireDoubleClick={variant === 'default'}
        />
      ))}
    </>
  )

  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-1 gap-3',
        'lg:grid-cols-12 lg:items-stretch lg:gap-x-3 lg:gap-y-0 xl:gap-x-4',
      )}
    >
      <div className="flex min-w-0 flex-col lg:col-span-5">
        <ShowcaseHeading variant={variant} />
          <div className="mt-8 lg:mt-10">
            <FluidSplitButton label="Explore More" href="/insights" />
          </div>
        <div className="mt-8 hidden flex-1 flex-col justify-end lg:mt-0 lg:flex lg:pt-16">
          <PaginationNav
            page={desktopScroller.page}
            totalPages={desktopScroller.totalPages}
            onPageChange={desktopScroller.goToPage}
            className="inline-flex"
          />
        </div>
      </div>

      <div
        className={cn(
          'min-w-0 -mr-8 sm:-mr-10 md:-mr-12 lg:col-span-7 lg:-mr-14 xl:-mr-16 2xl:-mr-20 3xl:-mr-28 4xl:-mr-32',
          variant === 'default' && '2xl:-ml-12 3xl:-ml-16 4xl:-ml-20',
        )}
      >
        {splitMobileDesktop ? (
          <>
            <div
              ref={(el) => {
                mobileScroller.ref.current = el
                mobileStripWheelRef(el)
              }}
              role="region"
              aria-label={variant === 'related' ? 'Related insight articles' : 'Insight articles'}
              className={cn(mobileTwoUp ? insightMobileTwoUpStripClass : insightStripClass, 'lg:hidden')}
              onPointerDown={dragScroll.onPointerDown}
              onPointerMove={dragScroll.onPointerMove}
              onPointerUp={dragScroll.onPointerUp}
              onPointerCancel={dragScroll.onPointerCancel}
              onClickCapture={dragScroll.onClickCapture}
            >
              {mobileStrip}
            </div>
            <div
              ref={(el) => {
                desktopScroller.ref.current = el
                desktopStripWheelRef(el)
              }}
              role="region"
              aria-label={variant === 'related' ? 'Related insight articles' : 'Insight articles'}
              className={cn(insightStripClass, 'hidden lg:flex')}
              onPointerDown={dragScroll.onPointerDown}
              onPointerMove={dragScroll.onPointerMove}
              onPointerUp={dragScroll.onPointerUp}
              onPointerCancel={dragScroll.onPointerCancel}
              onClickCapture={dragScroll.onClickCapture}
            >
              {desktopStrip}
            </div>
          </>
        ) : (
          <div
            ref={(el) => {
              desktopScroller.ref.current = el
              desktopStripWheelRef(el)
            }}
            role="region"
            aria-label={variant === 'related' ? 'Related insight articles' : 'Insight articles'}
            className={insightStripClass}
            onPointerDown={dragScroll.onPointerDown}
            onPointerMove={dragScroll.onPointerMove}
            onPointerUp={dragScroll.onPointerUp}
            onPointerCancel={dragScroll.onPointerCancel}
            onClickCapture={dragScroll.onClickCapture}
          >
            {desktopStrip}
          </div>
        )}
      </div>

      <PaginationNav
        page={splitMobileDesktop ? mobileScroller.page : desktopScroller.page}
        totalPages={splitMobileDesktop ? mobileScroller.totalPages : desktopScroller.totalPages}
        onPageChange={splitMobileDesktop ? mobileScroller.goToPage : desktopScroller.goToPage}
        className={cn('lg:hidden', mobileTwoUp && 'hidden')}
      />
    </div>
  )
}
