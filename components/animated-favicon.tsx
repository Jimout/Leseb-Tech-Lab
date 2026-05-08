'use client'

import * as React from 'react'

/** Files in `public/images/` — spaces encoded for URLs. */
const FAVICON_FRAMES = [
  `/images/${encodeURIComponent('logo-without 1.png')}`,
  `/images/${encodeURIComponent('logo-without 2.png')}`,
] as const

const INTERVAL_MS = 350

/**
 * Cycles the document favicon between two PNGs (fast flip). Apple touch icon is left unchanged.
 */
export function AnimatedFavicon() {
  React.useEffect(() => {
    const links = () =>
      Array.from(
        document.querySelectorAll<HTMLLinkElement>(
          'link[rel="icon"], link[rel="shortcut icon"]',
        ),
      ).filter((el) => !el.href.includes('apple-touch-icon'))

    let frame = 0
    const apply = () => {
      const href = FAVICON_FRAMES[frame]
      for (const el of links()) {
        el.type = 'image/png'
        el.href = `${href}?v=${frame}`
      }
      frame = (frame + 1) % FAVICON_FRAMES.length
    }

    apply()
    const id = window.setInterval(apply, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  return null
}
