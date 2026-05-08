import { permanentRedirect } from 'next/navigation'

import { getWorkDetailBySlug } from '@/lib/work-detail-data'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { resolveWorkRedirectSlug } from '@/lib/slug-service'

/** Resolve canonical work detail or permanently redirect legacy slugs recorded in SlugHistory. */
export async function resolveWorkPageBySlug(slug: string): Promise<ResolvedWorkDetail | null> {
  const redirectTo = await resolveWorkRedirectSlug(slug)
  if (redirectTo) permanentRedirect(`/work/${redirectTo}`)
  return getWorkDetailBySlug(slug)
}
