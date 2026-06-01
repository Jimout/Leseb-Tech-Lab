'use client'

import * as React from 'react'

import { readWorkRowsFromStorage } from '@/lib/frontend-content'
import { resolveWorkDetailFromShowcase } from '@/lib/work-detail-resolve'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { mergeWorkDetailRow } from '@/lib/work-detail-merge'
import type { WorkRow } from '@/lib/work-admin-types'
import { stripWorkRowToShowcase } from '@/lib/work-admin-types'

export function useWorkDetailForSlug(
  slug: string,
  serverDetail: ResolvedWorkDetail | null,
): { detail: ResolvedWorkDetail | null; ready: boolean } {
  const [detail, setDetail] = React.useState<ResolvedWorkDetail | null>(() => serverDetail)
  const [ready, setReady] = React.useState(() => serverDetail !== null)

  React.useEffect(() => {
    setDetail(serverDetail)
    setReady(serverDetail !== null)
  }, [serverDetail])

  React.useEffect(() => {
    const items = readWorkRowsFromStorage()
    const row = items.find((w) => w.slug === slug)
    if (!row) {
      setDetail(serverDetail)
      setReady(true)
      return
    }
    const base = serverDetail ?? resolveWorkDetailFromShowcase(stripWorkRowToShowcase(row))
    setDetail(mergeWorkDetailRow(base, row))
    setReady(true)
  }, [slug, serverDetail])

  return { detail, ready }
}
