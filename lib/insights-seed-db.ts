import type { Prisma } from '@/lib/generated/prisma/client'

import { SHOWCASE_INSIGHTS, type ShowcaseInsight } from '@/lib/insights-showcase-data'
import { prisma } from '@/lib/prisma'

/** Placeholder row created during early deploys — replace with full catalog seeds. */
const BOOTSTRAP_PLACEHOLDER_SLUGS = new Set(['hello', 'insight', 'sample'])

export function insightDbNeedsBootstrap(slugs: string[]): boolean {
  if (slugs.length === 0) return true
  if (slugs.length === 1 && BOOTSTRAP_PLACEHOLDER_SLUGS.has(slugs[0]!)) return true
  return false
}

function toCreateRow(row: ShowcaseInsight, index: number): Prisma.InsightCreateManyInput {
  return {
    id: row.id,
    publicId: row.publicId || `I${index + 1}`,
    slug: row.slug,
    date: row.date,
    dateIso: row.dateIso,
    title: row.title,
    description: row.description,
    heroMedia: row.heroMedia as Prisma.InputJsonValue,
    mediaAssets: row.mediaAssets as Prisma.InputJsonValue,
    href: row.href,
    filterIds: [...row.filterIds],
    bodyMode: row.bodyMode ?? null,
    simpleBodyHtml: row.simpleBodyHtml ?? null,
    article:
      row.article === undefined || row.article === null
        ? undefined
        : (row.article as Prisma.InputJsonValue),
    sortOrder: index,
  }
}

/**
 * Insert showcase insights when the table is empty or only has a placeholder row.
 * Does not delete existing real content.
 */
export async function seedInsightsFromShowcaseIfNeeded(): Promise<number> {
  const existing = await prisma.insight.findMany({
    select: { slug: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  const slugs = existing.map((r) => r.slug.trim()).filter(Boolean)
  if (!insightDbNeedsBootstrap(slugs)) return 0

  if (slugs.length === 1) {
    await prisma.insight.deleteMany({ where: { slug: slugs[0] } })
  }

  const data = SHOWCASE_INSIGHTS.map((row, index) => toCreateRow(row, index))
  await prisma.insight.createMany({ data, skipDuplicates: true })
  return data.length
}

/** Force-replace all insights with the showcase catalog (admin / local setup). */
export async function replaceInsightsWithShowcaseSeeds(): Promise<number> {
  const data = SHOWCASE_INSIGHTS.map((row, index) => toCreateRow(row, index))
  await prisma.$transaction([
    prisma.insight.deleteMany(),
    prisma.insight.createMany({ data }),
  ])
  return data.length
}
