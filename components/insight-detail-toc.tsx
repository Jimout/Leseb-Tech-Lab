'use client'

import * as React from 'react'
import { Menu } from 'lucide-react'

import { MediaRenderer } from '@/components/media-renderer'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { InsightTocItem } from '@/lib/insight-types'
import { cn } from '@/lib/utils'
import { useInsightTocMobileStore } from '@/stores/use-insight-toc-mobile-store'

function TocMark() {
  const { settings } = useSiteSettings()
  const { markDarkSrc, markLightSrc, markAlt } = settings.insightToc
  const src = markLightSrc || markDarkSrc

  return (
    <div className="flex h-8 w-10 shrink-0 items-center justify-end sm:h-9 sm:w-11">
      {src ? (
        <div className="relative h-7 w-11 sm:h-8 sm:w-12">
          <MediaRenderer
            media={{ type: 'image', url: src, alt: (markAlt ?? '').trim() ? markAlt : '' }}
            className="size-full object-contain object-right"
            variant="admin-preview"
          />
        </div>
      ) : (
        <span className="size-2 rounded-full bg-accent sm:size-2.5" />
      )}
    </div>
  )
}

const SCROLL_ACTIVATION_PX = 140

/** Matches desktop sidebar TOC card — reused for mobile dropdown panel. */
const tocCardClass = cn(
  'rounded-[20px] border border-border bg-card p-6 shadow-sm sm:p-7',
)

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

function TocLinks({
  items,
  activeId,
  onNavigate,
}: {
  items: readonly InsightTocItem[]
  activeId: string
  onNavigate?: () => void
}) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map(({ id, label }) => {
        const active = activeId === id
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={() => onNavigate?.()}
              className={cn(
                'text-[13px] font-medium leading-snug transition-[color,text-decoration-color] duration-150 sm:text-sm',
                active
                  ? 'text-accent underline decoration-accent decoration-1 underline-offset-[6px]'
                  : 'text-foreground/85 no-underline hover:text-foreground',
              )}
            >
              {label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function TocCardHeader() {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
        Contents
      </span>
      <TocMark />
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
    <nav
      className={cn('hidden lg:block', tocCardClass)}
      aria-label="Table of contents"
    >
      <TocCardHeader />
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
  }, [])

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
        'sticky z-30 flex items-center justify-between gap-3 border-b border-border/60',
        'bg-background/95 py-3 backdrop-blur-md supports-backdrop-filter:bg-background/90',
        'top-16 sm:top-17',
      )}
    >
      <p className="min-w-0 truncate text-left text-xs font-medium text-foreground/90 sm:text-sm">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Jump to · </span>
        {activeLabel}
      </p>
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-xl border border-border/70 bg-muted/40 text-foreground hover:bg-muted/70 hover:text-foreground"
          aria-expanded={open}
          aria-label={open ? 'Close table of contents' : 'Open table of contents'}
          onClick={toggleOpen}
        >
          <Menu className="size-5" strokeWidth={2} aria-hidden />
        </Button>
        <SheetContent
          side="top"
          anchorTopPx={anchorTop}
          showCloseButton={false}
          className={cn(
            'left-0 right-0 flex max-h-[min(72dvh,28rem)] justify-start border-0 bg-transparent p-0 pt-1 shadow-none gap-0 overflow-visible',
            'pl-8 pr-4 sm:pl-10 sm:pr-5 md:pl-12 md:pr-6',
          )}
        >
          <SheetTitle className="sr-only">Table of contents</SheetTitle>
          <nav
            className={cn(
              tocCardClass,
              'w-full max-w-md overflow-y-auto overscroll-contain sm:max-w-lg',
              'max-h-[min(calc(72dvh-1rem),26rem)]',
            )}
            aria-label="Table of contents"
          >
            <TocCardHeader />
            <TocLinks items={items} activeId={activeId} onNavigate={close} />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
