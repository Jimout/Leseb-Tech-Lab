'use client'

import * as React from 'react'
import Image from 'next/image'
import { List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
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

const tocPanelClass = cn(landingNewsletterPanelClass, 'p-5 sm:p-6')

function TocBrandMark({ className }: { className?: string }) {
  const { settings } = useSiteSettings()
  const toc = settings.insightToc
  const footerLogo = settings.footer.logoLightSrc?.trim() || settings.footer.logoDarkSrc?.trim()
  const src = toc.markLightSrc?.trim() || toc.markDarkSrc?.trim() || footerLogo || DEFAULT_TOC_LOGO
  const alt = toc.markAlt?.trim() || 'Leseb'

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
          <span className={insightDetailKickerClass}>On this page</span>
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
                'group flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 pr-7',
                'transition-colors duration-300 motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                active
                  ? 'text-foreground'
                  : 'text-foreground/75 hover:bg-foreground/[0.05] hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  insightDetailTocLinkClass,
                  'min-w-0 flex-1',
                  active ? 'font-medium' : undefined,
                )}
              >
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
  return (
    <nav className={cn('hidden lg:block', tocPanelClass)} aria-label="Table of contents">
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
  const { open, anchorTop, setOpen, setAnchorTop, toggleOpen, close } =
    useInsightTocMobileStore()
  const barRef = React.useRef<HTMLDivElement>(null)
  const activeLabel = items.find((i) => i.id === activeId)?.label ?? 'Contents'

  const syncAnchor = React.useCallback(() => {
    const el = barRef.current
    if (!el) return
    setAnchorTop(Math.ceil(el.getBoundingClientRect().bottom + 6))
  }, [setAnchorTop])

  React.useLayoutEffect(() => {
    if (!open) return
    syncAnchor()
    window.addEventListener('resize', syncAnchor)
    window.addEventListener('scroll', syncAnchor, { passive: true })
    return () => {
      window.removeEventListener('resize', syncAnchor)
      window.removeEventListener('scroll', syncAnchor)
    }
  }, [open, syncAnchor])

  React.useEffect(() => {
    return () => close()
  }, [close])

  return (
    <div
      ref={barRef}
      className={cn(
        'sticky z-30 -mx-4 flex items-center justify-between gap-3 border-b border-foreground/10 px-4',
        'bg-background/95 py-3 backdrop-blur-md supports-backdrop-filter:bg-background/90',
        'top-16 sm:-mx-5 sm:px-5 sm:top-17 lg:hidden',
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <TocBrandMark className="size-9 p-1.5 sm:size-10" />
        <p className="min-w-0 truncate text-left">
          <span className={cn(insightDetailKickerClass, 'block')}>On this page</span>
          <span className={cn(insightDetailTocLinkClass, 'block truncate font-medium text-foreground')}>
            {activeLabel}
          </span>
        </p>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'size-10 shrink-0 rounded-full border border-foreground/20 bg-foreground/[0.04]',
            'text-foreground transition-colors hover:border-signal/40 hover:bg-signal/10 hover:text-signal',
          )}
          aria-expanded={open}
          aria-label={open ? 'Close table of contents' : 'Open table of contents'}
          onClick={toggleOpen}
        >
          <List className="size-4" strokeWidth={2} aria-hidden />
        </Button>
        <SheetContent
          side="top"
          anchorTopPx={anchorTop}
          showCloseButton={false}
          className={cn(
            'left-0 right-0 flex max-h-[min(72dvh,28rem)] justify-start border-0 bg-transparent p-0 pt-1 shadow-none gap-0 overflow-visible',
            'px-4 sm:px-5',
          )}
        >
          <SheetTitle className="sr-only">Table of contents</SheetTitle>
          <nav
            className={cn(
              tocPanelClass,
              'w-full max-w-md overflow-y-auto overscroll-contain sm:max-w-lg',
              'max-h-[min(calc(72dvh-1rem),26rem)]',
            )}
            aria-label="Table of contents"
          >
            <TocHeader />
            <TocLinks items={items} activeId={activeId} onNavigate={close} />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
