import { getWorkDetailBySlug } from '@/lib/work-detail-data'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'

export async function resolveWorkPageBySlug(slug: string): Promise<ResolvedWorkDetail | null> {
  return getWorkDetailBySlug(slug)
}
