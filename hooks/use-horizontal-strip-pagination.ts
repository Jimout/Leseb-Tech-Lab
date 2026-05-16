'use client'

import * as React from 'react'

/**
 * Page-based horizontal strip: scroll to child index, sync active page from scroll/drag/touch.
 */
export function useHorizontalStripPagination(itemCount: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, itemCount)
  const syncingRef = React.useRef(false)

  const syncPageFromScroll = React.useCallback(() => {
    const el = ref.current
    if (!el || el.children.length === 0) return
    const left = el.scrollLeft
    let nearest = 0
    let nearestDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement
      const dist = Math.abs(child.offsetLeft - left)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    }
    const next = nearest + 1
    setPage((prev) => (prev === next ? prev : next))
  }, [])

  const goToPage = React.useCallback(
    (p: number) => {
      const el = ref.current
      if (!el) return
      const clamped = Math.min(Math.max(1, p), totalPages)
      const child = el.children[clamped - 1] as HTMLElement | undefined
      if (!child) return
      syncingRef.current = true
      child.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      setPage(clamped)
      window.setTimeout(() => {
        syncingRef.current = false
      }, 400)
    },
    [totalPages],
  )

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (syncingRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(syncPageFromScroll)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
    }
  }, [syncPageFromScroll, itemCount])

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return { ref, page, totalPages, goToPage, syncPageFromScroll }
}
