'use client'

import * as React from 'react'

export type NavSurface = 'light' | 'dark'

/**
 * Picks `light` / `dark` from `[data-nav-surface]` regions that overlap the top
 * band of the viewport (under the sticky navbar), so the shell can match the
 * section behind it while scrolling.
 */
export function useNavSurfaceScroll(navTrackSelector = '[data-site-navbar-track]'): NavSurface {
  const [surface, setSurface] = React.useState<NavSurface>('light')

  React.useEffect(() => {
    const readZones = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-nav-surface]')).filter((el) => {
        const v = el.dataset.navSurface
        return v === 'light' || v === 'dark'
      })

    const measure = () => {
      const track = document.querySelector<HTMLElement>(navTrackSelector)
      const navH = track?.getBoundingClientRect().height ?? 56
      const bandTop = 0
      const bandBottom = navH

      const zones = readZones()
      if (zones.length === 0) {
        setSurface('light')
        return
      }

      let best: { area: number; surface: NavSurface } | null = null
      for (const el of zones) {
        const r = el.getBoundingClientRect()
        const overlapTop = Math.max(bandTop, r.top)
        const overlapBottom = Math.min(bandBottom, r.bottom)
        const area = Math.max(0, overlapBottom - overlapTop)
        if (area <= 0) continue
        const s = el.dataset.navSurface as NavSurface
        if (!best || area > best.area) {
          best = { area, surface: s }
        }
      }

      setSurface(best?.surface ?? 'light')
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [navTrackSelector])

  return surface
}
