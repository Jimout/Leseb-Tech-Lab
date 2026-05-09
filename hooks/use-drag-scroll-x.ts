'use client'

import * as React from 'react'

type DragState = {
  active: boolean
  pointerId: number | null
  startX: number
  startScrollLeft: number
  moved: boolean
  suppressClickUntil: number
  el: HTMLDivElement | null
}

/**
 * Horizontal click/touch-drag scrolling for overflow strips.
 * - Uses Pointer Events so it works for mouse + touch.
 * - Suppresses click navigation briefly after a drag gesture.
 */
export function useDragScrollX() {
  const dragRef = React.useRef<DragState>({
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

