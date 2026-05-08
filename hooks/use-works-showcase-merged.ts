'use client'

import * as React from 'react'

import type { ShowcaseWork } from '@/lib/works-showcase-data'

export function useWorksShowcaseMerged(): ShowcaseWork[] {
  const [works, setWorks] = React.useState<ShowcaseWork[]>([])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/work-rows', { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { rows?: ShowcaseWork[] }
        if (!cancelled && Array.isArray(json.rows)) setWorks(json.rows)
      } catch {
        if (!cancelled) setWorks([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return works
}
