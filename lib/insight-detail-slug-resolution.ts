import { permanentRedirect } from 'next/navigation'

import type { InsightDetail } from '@/lib/insight-detail-types'
import { getInsightDetailBySlug } from '@/lib/insight-detail-data'
import { resolveInsightRedirectSlug } from '@/lib/slug-service'

export async function resolveInsightPageBySlug(slug: string): Promise<InsightDetail | null> {
  try {
    const redirectTo = await resolveInsightRedirectSlug(slug)
    if (redirectTo) permanentRedirect(`/insights/${redirectTo}`)
  } catch (error) {
    console.error('[insight-detail] resolveInsightRedirectSlug failed:', error)
  }
  return getInsightDetailBySlug(slug)
}
