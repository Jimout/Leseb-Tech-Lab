'use client'

import * as React from 'react'

import { readInsightsFromStorage } from '@/lib/frontend-content'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { resolveInsightDetailFromShowcaseRow } from '@/lib/insight-detail-resolve'
import { mergeInsightDetailRow } from '@/lib/insight-detail-merge'

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
    const items = readInsightsFromStorage()
    const row = items.find((i) => i.slug === slug)
    if (!row) {
      setDetail(serverDetail)
      setReady(true)
      return
    }
    const base = serverDetail ?? resolveInsightDetailFromShowcaseRow(row)
    setDetail(mergeInsightDetailRow(base, row))
    setReady(true)
  }, [slug, serverDetail])

  return { detail, ready }
}
