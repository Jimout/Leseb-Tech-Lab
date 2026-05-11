'use client'

import * as React from 'react'

import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { SHOWCASE_INSIGHTS } from '@/lib/insights-showcase-data'

export function useInsightsShowcaseMerged(): ShowcaseInsight[] {
  const [insights, setInsights] = React.useState<ShowcaseInsight[]>(() => [...SHOWCASE_INSIGHTS])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/insights', { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { insights?: ShowcaseInsight[] }
        if (cancelled) return
        if (Array.isArray(json.insights) && json.insights.length > 0) setInsights(json.insights)
      } catch {
        // Keep seed fallback.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return insights
}
