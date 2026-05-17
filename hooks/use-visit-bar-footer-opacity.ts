'use client'

import * as React from 'react'

const FOOTER_SELECTOR = 'footer#contact'
/** Distance (px) over which the bar fades out as the footer rises into view. */
const FADE_RANGE_PX = 160

function computeOpacity(footerTop: number, viewportHeight: number): number {
  const distanceFromBottom = footerTop - viewportHeight
  if (distanceFromBottom >= 0) return 1
  if (distanceFromBottom <= -FADE_RANGE_PX) return 0
  return 1 + distanceFromBottom / FADE_RANGE_PX
}

/**
 * Fades the work-detail “Visit website” bar as the site footer scrolls into view.
 */
export function useVisitBarFooterOpacity(): number {
  const [opacity, setOpacity] = React.useState(1)

  React.useEffect(() => {
    const footer = document.querySelector(FOOTER_SELECTOR)
    if (!footer) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = footer.getBoundingClientRect()
      setOpacity(computeOpacity(rect.top, window.innerHeight))
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return opacity
}
