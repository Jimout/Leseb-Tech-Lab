'use client'

import * as React from 'react'

import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

export function useInsightsShowcaseMerged(): ShowcaseInsight[] {
  const [insights, setInsights] = React.useState<ShowcaseInsight[]>([])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/insights', { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { insights?: ShowcaseInsight[] }
        if (!cancelled && Array.isArray(json.insights)) setInsights(json.insights)
      } catch {
        if (!cancelled) setInsights([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return insights
}
