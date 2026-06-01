import type { InsightDetail } from '@/lib/insight-detail-types'
import { getInsightDetailBySlug } from '@/lib/insight-detail-data'

export async function resolveInsightPageBySlug(slug: string): Promise<InsightDetail | null> {
  return getInsightDetailBySlug(slug)
}
