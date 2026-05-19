'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { CircleArrowPagination } from '@/components/circle-arrow-pagination'
import { MediaRenderer } from '@/components/media-renderer'
import { useFinePointerHover } from '@/hooks/use-fine-pointer-hover'
import type { MediaAsset } from '@/lib/media-assets'
import { cn } from '@/lib/utils'

const LERP = 0.22
const HOVER_CURSOR_SCALE = 1.12
const BASE_CURSOR_SIZE = 56

function getHoverCursorSize(viewportWidth: number) {
  if (viewportWidth >= 2560) return 124 // 4xl
  if (viewportWidth >= 1920) return 108 // 3xl
  if (viewportWidth >= 1536) return 92 // 2xl
  return BASE_CURSOR_SIZE
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function useHoverCursorSize() {
  const [size, setSize] = React.useState(BASE_CURSOR_SIZE)

  React.useEffect(() => {
    const update = () => setSize(getHoverCursorSize(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

export type WorkCardPaginationConfig = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export type WorkCardSurfaceProps = {
  heroMedia: MediaAsset | null
  /** Comma-separated categories — hover cutout shows first two + “+ n” */
  category: string
  priority?: boolean
  children: React.ReactNode
  pagination?: WorkCardPaginationConfig
  /** Masonry showcase: ~32px radius, full-color imagery */
  visualVariant?: 'default' | 'showcase'
}

function useCategoryPillParts(category: string) {
  return React.useMemo(() => {
    const tags = category
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    return { shown: tags.slice(0, 2), more: Math.max(0, tags.length - 2) }
  }, [category])
}

function WorkCardCategoryCutout({
  show,
  showcase,
  shown,
  more,
}: {
  show: boolean
  showcase: boolean
  shown: readonly string[]
  more: number
}) {
  if (shown.length === 0 && more === 0) return null

  const r = showcase ? 'rounded-bl-[1.75rem] sm:rounded-bl-[2rem]' : 'rounded-bl-2xl md:rounded-bl-3xl'

  return (
    <div
      className={cn(
        'pointer-events-none absolute right-0 top-0 z-10 flex max-w-[min(92%,16.5rem)] flex-nowrap items-center justify-end gap-1.5 overflow-hidden whitespace-nowrap sm:max-w-[min(88%,18rem)] sm:gap-2',
        'bg-background pl-3 pb-2.5 pr-2.5 pt-2.5 sm:pl-4 sm:pb-3 sm:pr-3 sm:pt-3',
        r,
        'transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)]',
        'transform-gpu',
        show
          ? 'translate-y-0 scale-100 opacity-100'
          : '-translate-y-1.5 scale-[0.99] opacity-0',
        'motion-reduce:translate-y-0 motion-reduce:transition-none',
      )}
      style={{ willChange: 'transform, opacity', transitionDuration: '650ms' }}
      aria-hidden
    >
      {shown.map((label) => (
        <span
          key={label}
          className="max-w-40 truncate rounded-full bg-secondary px-2.5 py-1.5 text-center font-sans text-[12px] font-medium leading-tight text-secondary-foreground sm:px-3 sm:py-1.5 sm:text-xs"
        >
          {label}
        </span>
      ))}
      {more > 0 ? (
        <span className="rounded-full bg-secondary px-2.5 py-1.5 font-sans text-[12px] font-medium tabular-nums text-secondary-foreground sm:py-1.5 sm:text-xs">
          + {more}
        </span>
      ) : null}
    </div>
  )
}

export function WorkCardSurface({
  heroMedia,
  category,
  priority,
  children,
  pagination,
  visualVariant = 'default',
}: WorkCardSurfaceProps) {
  const showcase = visualVariant === 'showcase'
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const targetRef = React.useRef({ x: 0, y: 0 })
  const posRef = React.useRef({ x: 0, y: 0 })

  const [hovered, setHovered] = React.useState(false)
  const [renderPos, setRenderPos] = React.useState({ x: 0, y: 0 })

  const fineHover = useFinePointerHover()
  const cursorSize = useHoverCursorSize()
  const showHover = fineHover && hovered
  const cursorLoop = fineHover && hovered

  const onMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - cursorSize / 2
    const y = e.clientY - rect.top - cursorSize / 2
    const maxX = rect.width - cursorSize
    const maxY = rect.height - cursorSize
    targetRef.current = {
      x: clamp(x, 0, Math.max(0, maxX)),
      y: clamp(y, 0, Math.max(0, maxY)),
    }
  }, [cursorSize])

  React.useEffect(() => {
    if (!cursorLoop) return
    let cancelled = false
    let id = 0
    const loop = () => {
      if (cancelled) return
      const el = wrapRef.current
      const t = targetRef.current
      const p = posRef.current
      p.x += (t.x - p.x) * LERP
      p.y += (t.y - p.y) * LERP
      if (el) {
        const maxX = Math.max(0, el.clientWidth - cursorSize)
        const maxY = Math.max(0, el.clientHeight - cursorSize)
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
  }, [cursorLoop, cursorSize])

  const onEnter = React.useCallback(() => {
    setHovered(true)
  }, [])

  const onLeave = React.useCallback(() => {
    setHovered(false)
  }, [])

  const scale = showHover ? HOVER_CURSOR_SCALE : 0
  const opacity = showHover ? 1 : 0

  const track = (
    <div
      ref={wrapRef}
      className={cn(
        'group relative isolate flex min-h-0 w-full flex-col gap-4 sm:gap-5',
        fineHover ? 'cursor-none' : 'cursor-auto',
      )}
      onMouseMove={fineHover ? onMove : undefined}
      onMouseEnter={fineHover ? onEnter : undefined}
      onMouseLeave={fineHover ? onLeave : undefined}
    >
      <div
        className={cn(
          'relative aspect-16/10 min-h-0 w-full shrink-0 overflow-hidden',
          showcase ? 'rounded-[1.75rem] sm:rounded-4xl' : 'rounded-2xl md:rounded-3xl',
        )}
      >
        {heroMedia ? (
          <MediaRenderer
            media={heroMedia}
            className={cn(
              'size-full object-cover select-none grayscale-72 saturate-[0.48]',
              fineHover &&
                'transition-[filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:saturate-100 motion-reduce:transition-none motion-reduce:grayscale-0 motion-reduce:saturate-100',
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            controls={false}
            autoplay={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-xs text-muted-foreground">
            No media
          </div>
        )}
      </div>

      <div className="relative z-1 min-w-0">{children}</div>

      <div
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-20 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md dark:bg-accent dark:text-accent-foreground',
          'motion-reduce:transition-none',
          'transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        )}
        style={{
          width: cursorSize,
          height: cursorSize,
          transform: `translate3d(${renderPos.x}px, ${renderPos.y}px, 0) scale(${scale})`,
          opacity,
          transformOrigin: 'center center',
        }}
        aria-hidden
      >
        <ArrowUpRight
          className={cn(
            'origin-center transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
            showHover ? 'scale-[1.28]' : 'scale-100',
          )}
          style={{ width: cursorSize * 0.42, height: cursorSize * 0.42 }}
          strokeWidth={1}
        />
      </div>
    </div>
  )

  if (!pagination) {
    return track
  }

  return (
    <div className="flex min-h-0 w-full flex-col gap-4 sm:gap-5">
      {track}
      <div
        className="relative z-10 flex justify-start sm:justify-center"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <CircleArrowPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      </div>
    </div>
  )
}
