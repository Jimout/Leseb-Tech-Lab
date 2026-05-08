'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { MediaRenderer } from '@/components/media-renderer'
import { useFinePointerHover } from '@/hooks/use-fine-pointer-hover'
import type { MediaAsset } from '@/lib/media-assets'
import { cn } from '@/lib/utils'

/** Bounds for clamping pill position (≈ px-3 py-1.5 text-xs “Read”) */
const READ_PILL_W = 56
const READ_PILL_H = 32
const LERP = 0.14
const EXIT_MS = 320

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export type InsightCardProps = {
  date: string
  dateIso?: string
  title: string
  description: string
  heroMedia: MediaAsset | null
  className?: string
  href?: string
  priority?: boolean
  /** Label on the cursor-following pill */
  readLabel?: string
  /** `false` = simple card for directory grids (no Read pill). Default `true`. */
  interactivePill?: boolean
  /** Passed to next/image `sizes` */
  imageSizes?: string
  /** When true, links open on double-click only. */
  requireDoubleClick?: boolean
}

function InsightCardBody({
  date,
  dateIso,
  title,
  description,
  heroMedia,
  priority,
  imageSizes,
}: Omit<InsightCardProps, 'className' | 'href' | 'readLabel' | 'interactivePill'>) {
  const dateEl = dateIso ? (
    <time dateTime={dateIso} className="text-[10px] text-muted-foreground sm:text-xs">
      {date}
    </time>
  ) : (
    <p className="text-[10px] text-muted-foreground sm:text-xs">{date}</p>
  )

  const hasCover = Boolean(heroMedia?.url?.trim())

  return (
    <>
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:rounded-3xl">
        {!hasCover ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-muted/40"
            aria-hidden
          >
            <span className="text-[10px] font-medium text-muted-foreground/80 sm:text-xs">No cover image</span>
          </div>
        ) : (
          <MediaRenderer
            media={heroMedia!}
            className="absolute inset-0 size-full object-cover object-center"
            sizes={imageSizes ?? '(max-width: 640px) 280px, 320px'}
            controls={false}
            autoplay={false}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 pt-2.5 sm:gap-1.5 sm:pt-3">
        {dateEl}
        <h3 className="text-sm font-bold leading-snug tracking-tight text-foreground sm:text-base">
          {title}
        </h3>
        <p className="line-clamp-3 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
          {description}
        </p>
      </div>
    </>
  )
}

function InsightCardTrackFinePointer({
  children,
  readLabel,
}: {
  children: React.ReactNode
  readLabel: string
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const targetRef = React.useRef({ x: 0, y: 0 })
  const posRef = React.useRef({ x: 0, y: 0 })

  const [hovered, setHovered] = React.useState(false)
  const [leaving, setLeaving] = React.useState(false)
  const [renderPos, setRenderPos] = React.useState({ x: 0, y: 0 })

  const show = hovered && !leaving
  const scale = show ? 1 : 0
  const opacity = show ? 1 : 0

  const onMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const maxX = Math.max(0, r.width - READ_PILL_W)
    const maxY = Math.max(0, r.height - READ_PILL_H)
    const x = e.clientX - r.left - READ_PILL_W / 2
    const y = e.clientY - r.top - READ_PILL_H / 2
    targetRef.current = {
      x: clamp(x, 0, maxX),
      y: clamp(y, 0, maxY),
    }
  }, [])

  React.useEffect(() => {
    if (!hovered) return
    let cancelled = false
    let id = 0
    const loop = () => {
      if (cancelled) return
      const t = targetRef.current
      const p = posRef.current
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        p.x = t.x
        p.y = t.y
      } else {
        p.x += (t.x - p.x) * LERP
        p.y += (t.y - p.y) * LERP
      }
      const el = wrapRef.current
      if (el) {
        const maxX = Math.max(0, el.clientWidth - READ_PILL_W)
        const maxY = Math.max(0, el.clientHeight - READ_PILL_H)
        p.x = clamp(p.x, 0, maxX)
        p.y = clamp(p.y, 0, maxY)
      }
      setRenderPos({ x: p.x, y: p.y })
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [hovered])

  const onEnter = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setLeaving(false)
      setHovered(true)
      onMove(e)
    },
    [onMove],
  )

  const onLeave = React.useCallback(() => {
    setHovered(false)
    setLeaving(true)
    window.setTimeout(() => setLeaving(false), EXIT_MS)
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full cursor-none max-md:cursor-auto"
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      <div
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-20 will-change-transform',
          'motion-reduce:transition-none',
          'transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        )}
        style={{
          transform: `translate3d(${renderPos.x}px, ${renderPos.y}px, 0) scale(${scale})`,
          opacity,
        }}
        aria-hidden
      >
        <span className="inline-flex items-center justify-center rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground shadow-sm">
          {readLabel}
        </span>
      </div>
    </div>
  )
}

function InsightCardTrack({
  children,
  readLabel,
}: {
  children: React.ReactNode
  readLabel: string
}) {
  const fineHover = useFinePointerHover()
  if (!fineHover) {
    return <div className="relative w-full">{children}</div>
  }
  return (
    <InsightCardTrackFinePointer readLabel={readLabel}>
      {children}
    </InsightCardTrackFinePointer>
  )
}

const linkSurface =
  'block w-full max-w-full text-left outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function InsightCard(props: InsightCardProps) {
  const router = useRouter()
  const {
    className,
    href,
    readLabel = 'Read',
    interactivePill = true,
    imageSizes,
    requireDoubleClick = false,
    ...bodyProps
  } = props

  const article = (
    <article className={interactivePill ? 'bg-background' : 'bg-transparent'}>
      <InsightCardBody {...bodyProps} imageSizes={imageSizes} />
    </article>
  )

  if (!interactivePill) {
    if (href) {
      return (
        <Link href={href} className={cn(linkSurface, className)}>
          {article}
        </Link>
      )
    }
    return <div className={cn('w-full max-w-full', className)}>{article}</div>
  }

  const tracked = <InsightCardTrack readLabel={readLabel}>{article}</InsightCardTrack>

  if (href) {
    return (
      <Link
        href={href}
        className={cn(linkSurface, className)}
        onClick={requireDoubleClick ? (e) => e.preventDefault() : undefined}
        onDoubleClick={
          requireDoubleClick
            ? (e) => {
                e.preventDefault()
                router.push(href)
              }
            : undefined
        }
      >
        {tracked}
      </Link>
    )
  }

  return (
    <div className={cn('w-full max-w-full', className)}>
      {tracked}
    </div>
  )
}
