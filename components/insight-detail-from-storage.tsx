'use client'

import { notFound } from 'next/navigation'

import { InsightDetailContent } from '@/components/insight-detail-content'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { useInsightDetailForSlug } from '@/hooks/use-insight-detail-for-slug'

function InsightDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted-foreground">
      <p className="text-sm sm:text-base">Loading…</p>
    </div>
  )
}

export function InsightDetailFromStorage({
  slug,
  serverDetail,
}: {
  slug: string
  serverDetail: InsightDetail | null
}) {
  const { detail, ready } = useInsightDetailForSlug(slug, serverDetail)

  if (detail) return <InsightDetailContent detail={detail} />
  if (!ready) return <InsightDetailLoading />
  notFound()
}
