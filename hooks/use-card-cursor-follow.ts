'use client'

import * as React from 'react'

import { LERP } from '@/components/resource-card-util'

export function useCardCursorFollow(enabled: boolean) {
  const targetRef = React.useRef({ x: 0, y: 0 })
  const posRef = React.useRef({ x: 0, y: 0 })
  const [pos, setPos] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    if (!enabled) return
    let id = 0
    const tick = () => {
      const t = targetRef.current
      const p = posRef.current
      const reduce =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        p.x = t.x
        p.y = t.y
      } else {
        p.x += (t.x - p.x) * LERP
        p.y += (t.y - p.y) * LERP
      }
      setPos({ x: p.x, y: p.y })
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [enabled])

  const syncTo = React.useCallback((x: number, y: number) => {
    targetRef.current = { x, y }
    posRef.current = { x, y }
    setPos({ x, y })
  }, [])

  return { targetRef, pos, syncTo }
}
