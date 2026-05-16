import { prisma } from '@/lib/prisma'
import { slugifyTitle, type SlugEntityType } from '@/lib/slug-format'

export type { SlugEntityType } from '@/lib/slug-format'

export { normalizeSlugInput } from '@/lib/slug-format'

export async function slugExistsForWork(slug: string, excludeWorkId?: string | null): Promise<boolean> {
  const row = await prisma.work.findFirst({
    where: {
      slug,
      ...(excludeWorkId ? { NOT: { id: excludeWorkId } } : {}),
    },
    select: { id: true },
  })
  return row !== null
}

export async function slugExistsForInsight(
  slug: string,
  excludeInsightId?: string | null,
): Promise<boolean> {
  const row = await prisma.insight.findFirst({
    where: {
      slug,
      ...(excludeInsightId ? { NOT: { id: excludeInsightId } } : {}),
    },
    select: { id: true },
  })
  return row !== null
}

/**
 * Returns a unique slug for the given model, appending `-2`, `-3`, … if needed.
 */
export async function generateUniqueSlug(
  baseSlug: string,
  model: SlugEntityType,
  excludeEntityId?: string | null,
): Promise<string> {
  const base = slugifyTitle(baseSlug) || 'item'
  let candidate = base
  let n = 2
  for (;;) {
    const taken =
      model === 'work'
        ? await slugExistsForWork(candidate, excludeEntityId)
        : await slugExistsForInsight(candidate, excludeEntityId)
    if (!taken) return candidate
    candidate = `${base}-${n}`
    n += 1
  }
}

export async function recordSlugHistory(
  entityId: string,
  entityType: SlugEntityType,
  oldSlug: string,
): Promise<void> {
  if (!oldSlug.trim()) return
  try {
    await prisma.slugHistory.create({
      data: {
        entityId,
        entityType,
        oldSlug: oldSlug.trim(),
      },
    })
  } catch (e) {
    console.warn('[slug-history] skip duplicate oldSlug', oldSlug, e)
  }
}

export async function resolveWorkRedirectSlug(fromSlug: string): Promise<string | null> {
  try {
    const direct = await prisma.work.findUnique({
      where: { slug: fromSlug },
      select: { slug: true },
    })
    if (direct) return null

    const hist = await prisma.slugHistory.findUnique({
      where: { oldSlug: fromSlug },
      select: { entityId: true, entityType: true },
    })
    if (!hist || hist.entityType !== 'work') return null
    const row = await prisma.work.findUnique({
      where: { id: hist.entityId },
      select: { slug: true },
    })
    return row?.slug ?? null
  } catch (error) {
    console.error('[slug-service] resolveWorkRedirectSlug failed:', error)
    return null
  }
}

export async function resolveInsightRedirectSlug(fromSlug: string): Promise<string | null> {
  try {
    const direct = await prisma.insight.findUnique({
      where: { slug: fromSlug },
      select: { slug: true },
    })
    if (direct) return null

    const hist = await prisma.slugHistory.findUnique({
      where: { oldSlug: fromSlug },
      select: { entityId: true, entityType: true },
    })
    if (!hist || hist.entityType !== 'insight') return null
    const row = await prisma.insight.findUnique({
      where: { id: hist.entityId },
      select: { slug: true },
    })
    return row?.slug ?? null
  } catch (error) {
    console.error('[slug-service] resolveInsightRedirectSlug failed:', error)
    return null
  }
}
