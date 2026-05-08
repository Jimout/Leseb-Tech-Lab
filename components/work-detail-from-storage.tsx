'use client'

import * as React from 'react'

import { WorkDetailContent } from '@/components/work-detail-content'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { useWorkDetailForSlug } from '@/hooks/use-work-detail-for-slug'

function WorkDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted-foreground">
      <p className="text-sm sm:text-base">Loading…</p>
    </div>
  )
}

export function WorkDetailFromStorage({
  slug,
  serverDetail,
}: {
  slug: string
  serverDetail: ResolvedWorkDetail | null
}) {
  const { detail, ready } = useWorkDetailForSlug(slug, serverDetail)

  if (detail) return <WorkDetailContent detail={detail} />
  if (!ready) return <WorkDetailLoading />
  return <WorkDetailLoading />
}
