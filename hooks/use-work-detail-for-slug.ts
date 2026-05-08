'use client'

import * as React from 'react'

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
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/work-rows', { cache: 'no-store' })
        if (!res.ok) {
          if (!cancelled) setDetail(serverDetail)
          return
        }
        const json = (await res.json()) as { rows?: WorkRow[] }
        const items = Array.isArray(json.rows) ? json.rows : []
        const row = items.find((w) => w.slug === slug)
        if (!row) {
          if (!cancelled) setDetail(serverDetail)
          return
        }
        const base = serverDetail ?? resolveWorkDetailFromShowcase(stripWorkRowToShowcase(row))
        if (!cancelled) setDetail(mergeWorkDetailRow(base, row))
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
