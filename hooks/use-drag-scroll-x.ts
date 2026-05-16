'use client'

import * as React from 'react'

type DragState = {
  active: boolean
  pointerId: number | null
  startX: number
  startScrollLeft: number
  lastX: number
  lastTime: number
  velocity: number
  moved: boolean
  suppressClickUntil: number
  el: HTMLDivElement | null
  momentumRaf: number | null
}

type UseDragScrollXOptions = {
  /** When true, only mouse drags scroll the strip; touch uses native pan. */
  mouseOnly?: boolean
  /** Inertial glide after mouse release (default true). */
  momentum?: boolean
  /** Snap to the nearest child when the gesture ends (default true). */
  snapOnRelease?: boolean
}

const FRICTION = 0.92
const MIN_VELOCITY = 0.12
const CLICK_SUPPRESS_MS = 150
const MOVE_THRESHOLD = 3

function snapToNearestChild(el: HTMLDivElement) {
  if (el.children.length === 0) return
  let nearest = 0
  let nearestDist = Infinity
  const { scrollLeft } = el
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i] as HTMLElement
    const dist = Math.abs(child.offsetLeft - scrollLeft)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = i
    }
  }
  const target = el.children[nearest] as HTMLElement
  el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
}

function setDragScrollStyles(el: HTMLDivElement, dragging: boolean) {
  if (dragging) {
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
  } else {
    el.style.scrollSnapType = ''
    el.style.scrollBehavior = ''
  }
}

/**
 * Horizontal click/drag scrolling for overflow strips.
 * Disables scroll-snap while dragging and optionally applies momentum + snap on release.
 */
export function useDragScrollX(options?: UseDragScrollXOptions) {
  const mouseOnly = options?.mouseOnly ?? false
  const enableMomentum = options?.momentum ?? true
  const snapOnRelease = options?.snapOnRelease ?? true

  const dragRef = React.useRef<DragState>({
    active: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    moved: false,
    suppressClickUntil: 0,
    el: null,
    momentumRaf: null,
  })

  const cancelMomentum = React.useCallback(() => {
    const d = dragRef.current
    if (d.momentumRaf != null) {
      cancelAnimationFrame(d.momentumRaf)
      d.momentumRaf = null
    }
  }, [])

  const finishGesture = React.useCallback(
    (el: HTMLDivElement, moved: boolean) => {
      setDragScrollStyles(el, false)
      if (moved && snapOnRelease) {
        window.setTimeout(() => snapToNearestChild(el), 0)
      }
    },
    [snapOnRelease],
  )

  const runMomentum = React.useCallback(
    (el: HTMLDivElement, initialVelocity: number, moved: boolean) => {
      cancelMomentum()
      let vScroll = -initialVelocity

      const step = () => {
        if (Math.abs(vScroll) < MIN_VELOCITY) {
          dragRef.current.momentumRaf = null
          finishGesture(el, moved)
          return
        }

        const max = el.scrollWidth - el.clientWidth
        const next = Math.max(0, Math.min(max, el.scrollLeft + vScroll * 16))

        if (next === el.scrollLeft) {
          dragRef.current.momentumRaf = null
          finishGesture(el, moved)
          return
        }

        el.scrollLeft = next
        vScroll *= FRICTION
        dragRef.current.momentumRaf = requestAnimationFrame(step)
      }

      dragRef.current.momentumRaf = requestAnimationFrame(step)
    },
    [cancelMomentum, finishGesture],
  )

  React.useEffect(() => () => cancelMomentum(), [cancelMomentum])

  const endDrag = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current
      if (!d.el || d.pointerId !== e.pointerId) return

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }

      const el = d.el
      const moved = d.moved
      const velocity = d.velocity

      if (moved) d.suppressClickUntil = Date.now() + CLICK_SUPPRESS_MS

      d.active = false
      d.pointerId = null
      d.moved = false
      d.el = null

      if (!moved) {
        setDragScrollStyles(el, false)
        return
      }

      if (enableMomentum && Math.abs(velocity) >= MIN_VELOCITY) {
        runMomentum(el, velocity, moved)
        return
      }

      finishGesture(el, moved)
    },
    [enableMomentum, finishGesture, runMomentum],
  )

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      if (mouseOnly && e.pointerType !== 'mouse') return

      const el = e.currentTarget
      cancelMomentum()
      setDragScrollStyles(el, true)

      const now = performance.now()
      el.setPointerCapture(e.pointerId)

      dragRef.current = {
        active: true,
        pointerId: e.pointerId,
        startX: e.clientX,
        startScrollLeft: el.scrollLeft,
        lastX: e.clientX,
        lastTime: now,
        velocity: 0,
        moved: false,
        suppressClickUntil: dragRef.current.suppressClickUntil,
        el,
        momentumRaf: null,
      }

      e.preventDefault()
    },
    [cancelMomentum, mouseOnly],
  )

  const onPointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active || !d.el || d.pointerId !== e.pointerId) return

    const dx = e.clientX - d.startX
    if (Math.abs(dx) > MOVE_THRESHOLD) d.moved = true

    const now = performance.now()
    const dt = now - d.lastTime
    if (dt > 0) {
      const instant = (e.clientX - d.lastX) / dt
      d.velocity = d.velocity * 0.65 + instant * 0.35
    }
    d.lastX = e.clientX
    d.lastTime = now

    const max = d.el.scrollWidth - d.el.clientWidth
    d.el.scrollLeft = Math.max(0, Math.min(max, d.startScrollLeft - dx))
  }, [])

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      endDrag(e)
    },
    [endDrag],
  )

  const onPointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      endDrag(e)
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
