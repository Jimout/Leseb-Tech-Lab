'use client'

import * as React from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { InsightTocItem } from '@/lib/insight-types'
import {
  insightDetailKickerClass,
  insightDetailTocHeadingClass,
  insightDetailTocLinkClass,
} from '@/lib/insight-detail-typography'
import {
  landingNewsletterPanelClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'
import { useInsightTocMobileStore } from '@/stores/use-insight-toc-mobile-store'

const DEFAULT_TOC_LOGO = '/Leseb-logo.png'
const SCROLL_ACTIVATION_PX = 140

const tocPanelClass = cn(
  landingNewsletterPanelClass,
  'overflow-visible p-5 sm:p-6',
)

const tocMobileShellClass = cn(
  'sticky z-40 -mx-4 mb-4 px-4 sm:-mx-5 sm:mb-5 sm:px-5 lg:hidden',
  'top-[var(--site-nav-header-height,4.25rem)]',
)

/** Match work / insight catalog cards (`workLabCardShellClass`). */
const tocMobileSurfaceClass = cn(
  'border border-catalog-card-border bg-catalog-card',
  'shadow-[0_16px_36px_-24px_rgba(0,0,0,0.45)]',
)

const tocMobileBoxClass = cn('relative rounded-2xl lg:rounded-2xl', tocMobileSurfaceClass)

const tocMobileDropdownClass = cn(
  'absolute inset-x-0 top-full z-50 overflow-hidden rounded-b-2xl',
  'border-x border-b border-catalog-card-border bg-catalog-card',
  'shadow-[0_16px_36px_-24px_rgba(0,0,0,0.45)]',
  'transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none',
)

const tocMobileDropdownNavClass = 'px-4 pb-4 pt-3 sm:px-5'

type InsightTocSettings = {
  markSrc?: string
  markAlt?: string
}

function TocBrandMark({ className }: { className?: string }) {
  const { settings, ready } = useSiteSettings()
  
  if (!ready) {
    return (
      <div className={cn('relative shrink-0 overflow-hidden rounded-xl border border-foreground/12 bg-background/60', 'size-11 p-2 sm:size-12', className)} />
    )
  }
  
  const toc = (settings as any)?.insightToc as InsightTocSettings | undefined
  const src = toc?.markSrc?.trim() || DEFAULT_TOC_LOGO
  const alt = toc?.markAlt?.trim() || 'Leseb'

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-xl border border-foreground/12 bg-background/60',
        'size-11 p-2 sm:size-12',
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-contain p-1.5" sizes="48px" />
    </div>
  )
}

function TocHeader({ className }: { className?: string }) {
  return (
    <div className={cn('mb-5 flex items-center gap-3 sm:mb-6', className)}>
      <TocBrandMark />
      <div className="min-w-0">
        <p className={cn('mb-1', landingSectionKickerClass)}>
          <span className={landingSectionKickerDotClass} aria-hidden />
          On this page
        </p>
        <p className={insightDetailTocHeadingClass}>Contents</p>
      </div>
    </div>
  )
}

export function useInsightTocActiveSection(ids: string[]) {
  const [activeId, setActiveId] = React.useState(ids[0] ?? '')

  React.useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
    if (hash && ids.includes(hash)) setActiveId(hash)
  }, [ids])

  React.useEffect(() => {
    if (ids.length === 0) return

    const pickActive = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= SCROLL_ACTIVATION_PX) current = id
      }
      return current
    }

    let raf = 0
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const next = pickActive()
        setActiveId((prev) => (prev === next ? prev : next))
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ids])

  return activeId
}

type TocIndicator = { top: number; height: number; ready: boolean }

function TocLinks({
  items,
  activeId,
  onNavigate,
}: {
  items: readonly InsightTocItem[]
  activeId: string
  onNavigate?: () => void
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef(new Map<string, HTMLLIElement>())
  const [indicator, setIndicator] = React.useState<TocIndicator>({ top: 0, height: 0, ready: false })

  const updateIndicator = React.useCallback(() => {
    const wrapper = wrapperRef.current
    const item = itemRefs.current.get(activeId)
    if (!wrapper || !item) {
      setIndicator((prev) => (prev.ready ? { ...prev, ready: false } : prev))
      return
    }

    const wrapperRect = wrapper.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    setIndicator({
      top: itemRect.top - wrapperRect.top,
      height: itemRect.height,
      ready: true,
    })
  }, [activeId])

  React.useLayoutEffect(() => {
    updateIndicator()

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const ro = new ResizeObserver(updateIndicator)
    ro.observe(wrapper)
    for (const { id } of items) {
      const el = itemRefs.current.get(id)
      if (el) ro.observe(el)
    }

    window.addEventListener('resize', updateIndicator)
    window.addEventListener('scroll', updateIndicator, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateIndicator)
      window.removeEventListener('scroll', updateIndicator)
    }
  }, [items, updateIndicator])

  return (
    <div ref={wrapperRef} className="relative">
      {indicator.ready ? (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 z-0',
            'rounded-xl border border-signal/45 bg-signal/10',
            'transition-[top,height] duration-300 ease-out motion-reduce:transition-none',
          )}
          style={{ top: indicator.top, height: indicator.height }}
        >
          <span className="absolute top-1/2 right-3 size-1.5 -translate-y-1/2 rounded-full bg-signal" />
        </div>
      ) : null}
      <ul className="relative z-10 flex flex-col gap-1.5" role="list">
      {items.map(({ id, label }) => {
        const active = activeId === id
        return (
          <li
            key={id}
            ref={(el) => {
              if (el) itemRefs.current.set(id, el)
              else itemRefs.current.delete(id)
            }}
          >
            <a
              href={`#${id}`}
              onClick={() => onNavigate?.()}
              aria-current={active ? 'location' : undefined}
              className={cn(
                'group flex w-full items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 pr-8',
                'transition-colors duration-300 motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                active
                  ? 'text-foreground'
                  : 'text-foreground/75 hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              <span className={cn(insightDetailTocLinkClass, active ? 'font-medium' : undefined)}>
                {label}
              </span>
            </a>
          </li>
        )
      })}
      </ul>
    </div>
  )
}

export function InsightDetailTocDesktop({
  items,
  activeId,
}: {
  items: readonly InsightTocItem[]
  activeId: string
}) {
  if (items.length === 0) return null
  
  return (
    <nav className={cn('hidden w-full min-w-0 lg:block', tocPanelClass)} aria-label="Table of contents">
      <TocHeader />
      <TocLinks items={items} activeId={activeId} />
    </nav>
  )
}

export function InsightDetailTocMobile({
  items,
  activeId,
}: {
  items: readonly InsightTocItem[]
  activeId: string
}) {
  const { open, toggleOpen, close } = useInsightTocMobileStore()
  const panelId = React.useId()
  const activeLabel = items.find((i) => i.id === activeId)?.label ?? 'Contents'

  if (items.length === 0) return null

  React.useEffect(() => {
    return () => close()
  }, [close])

  return (
    <div className={tocMobileShellClass}>
      <div className={cn(tocMobileBoxClass, open && 'rounded-b-none border-b-transparent')}>
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-start gap-2.5">
            <TocBrandMark className="size-9 p-1.5 sm:size-10" />
            <p className="min-w-0 text-left">
              <span className={cn(insightDetailKickerClass, 'block')}>On this page</span>
              <span className={cn(insightDetailTocLinkClass, 'block font-medium text-foreground')}>
                {activeLabel}
              </span>
            </p>
          </div>
          <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'size-8 shrink-0 rounded-full border border-foreground/20 bg-foreground/6',
            'text-foreground transition-colors hover:border-signal/40 hover:bg-signal/10 hover:text-signal',
          )}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Collapse table of contents' : 'Expand table of contents'}
          onClick={toggleOpen}
        >
          <ChevronDown
            className={cn(
              'size-3.5 transition-transform duration-300 motion-reduce:transition-none',
              open && 'rotate-180',
            )}
            strokeWidth={1.75}
            aria-hidden
          />
        </Button>
      </div>

        <div
          id={panelId}
          className={cn(
            tocMobileDropdownClass,
            open
              ? 'max-h-[min(70dvh,28rem)] opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none',
          )}
          aria-hidden={!open}
        >
          <nav
            className={cn(
              tocMobileDropdownNavClass,
              'max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain',
            )}
            aria-label="Table of contents"
          >
            <TocLinks items={items} activeId={activeId} onNavigate={close} />
          </nav>
        </div>
      </div>
    </div>
  )
}