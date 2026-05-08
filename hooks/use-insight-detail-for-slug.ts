'use client'

import * as React from 'react'

import type { InsightDetail } from '@/lib/insight-detail-types'
import { resolveInsightDetailFromShowcaseRow } from '@/lib/insight-detail-resolve'
import { mergeInsightDetailRow } from '@/lib/insight-detail-merge'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

export function useInsightDetailForSlug(
  slug: string,
  serverDetail: InsightDetail | null,
): { detail: InsightDetail | null; ready: boolean } {
  const [detail, setDetail] = React.useState<InsightDetail | null>(() => serverDetail)
  const [ready, setReady] = React.useState(() => serverDetail !== null)

  React.useEffect(() => {
    setDetail(serverDetail)
    setReady(serverDetail !== null)
  }, [serverDetail])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/insights', { cache: 'no-store' })
        if (!res.ok) {
          if (!cancelled) setDetail(serverDetail)
          return
        }
        const json = (await res.json()) as { insights?: ShowcaseInsight[] }
        const items = Array.isArray(json.insights) ? json.insights : []
        const row = items.find((i) => i.slug === slug)
        if (!row) {
          if (!cancelled) setDetail(serverDetail)
          return
        }
        const base = serverDetail ?? resolveInsightDetailFromShowcaseRow(row)
        if (!cancelled) setDetail(mergeInsightDetailRow(base, row))
      } catch {
        if (!cancelled) setDetail(serverDetail)
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, serverDetail])

  return { detail, ready }
}
