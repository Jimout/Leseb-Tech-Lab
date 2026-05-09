'use client'

import * as React from 'react'

/**
 * Normalize wheel deltas so LINE/PAGE modes behave like PIXELS (trackpad-friendly).
 */
function normalizeWheelDeltas(el: HTMLElement, e: WheelEvent): { dx: number; dy: number } {
  let dx = e.deltaX
  let dy = e.deltaY
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    dx *= 16
    dy *= 16
  } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    dx *= el.clientWidth
    dy *= el.clientHeight
  }
  return { dx, dy }
}

/**
 * Scroll `node` horizontally when the gesture is clearly horizontal (or Shift+vertical wheel).
 * Strong vertical dominance leaves the event alone so the page can scroll.
 */
export function applyHorizontalStripWheel(node: HTMLElement, e: WheelEvent): void {
  if (node.scrollWidth <= node.clientWidth) return

  const { dx, dy } = normalizeWheelDeltas(node, e)
  const absX = Math.abs(dx)
  const absY = Math.abs(dy)

  let horizontalDelta: number | null = null
  if (e.shiftKey && dy !== 0) {
    horizontalDelta = dy
  } else if (absY > absX * 1.18) {
    horizontalDelta = null
  } else if (absX >= absY * 1.02 && absX >= 0.35) {
    horizontalDelta = dx
  }

  if (horizontalDelta == null) return

  const max = node.scrollWidth - node.clientWidth
  const next = Math.max(0, Math.min(max, node.scrollLeft + horizontalDelta))
  if (next === node.scrollLeft) return

  e.preventDefault()
  e.stopPropagation()
  node.scrollLeft = next
}

/**
 * Callback ref: attaches a non-passive `wheel` listener so `preventDefault` works
 * (React `onWheel` is passive on many roots — horizontal scrolling over a tall page fails).
 */
export function useHorizontalStripWheelCallback<T extends HTMLElement>(): React.RefCallback<T> {
  const cleanupRef = React.useRef<(() => void) | null>(null)

  React.useEffect(() => () => cleanupRef.current?.(), [])

  return React.useCallback((node: T | null) => {
    cleanupRef.current?.()
    cleanupRef.current = null
    if (!node) return

    const onWheel = (e: WheelEvent) => {
      applyHorizontalStripWheel(node, e)
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    cleanupRef.current = () => node.removeEventListener('wheel', onWheel)
  }, [])
}
