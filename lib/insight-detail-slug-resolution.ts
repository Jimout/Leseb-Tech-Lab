import { permanentRedirect } from 'next/navigation'

import type { InsightDetail } from '@/lib/insight-detail-types'
import { getInsightDetailBySlug } from '@/lib/insight-detail-data'
import { resolveInsightRedirectSlug } from '@/lib/slug-service'

export async function resolveInsightPageBySlug(slug: string): Promise<InsightDetail | null> {
  const redirectTo = await resolveInsightRedirectSlug(slug)
  if (redirectTo) permanentRedirect(`/insights/${redirectTo}`)
  return getInsightDetailBySlug(slug)
}
