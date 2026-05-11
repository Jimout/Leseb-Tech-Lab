'use client'

import * as React from 'react'

import type { ShowcaseWork } from '@/lib/works-showcase-data'
import { SHOWCASE_WORKS } from '@/lib/works-showcase-data'

export function useWorksShowcaseMerged(): ShowcaseWork[] {
  const [works, setWorks] = React.useState<ShowcaseWork[]>(() => [...SHOWCASE_WORKS])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/work-rows', { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { rows?: ShowcaseWork[] }
        if (cancelled) return
        if (Array.isArray(json.rows) && json.rows.length > 0) setWorks(json.rows)
      } catch {
        // Keep seed fallback.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return works
}
