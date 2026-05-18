import { createId } from '@paralleldrive/cuid2'
import type { Prisma } from '@/lib/generated/prisma/client'

import { migrateCatalogFilterIds } from '@/lib/catalog-filter-ids'
import { insightHref, type ShowcaseInsight } from '@/lib/insights-showcase-data'
import type { InsightArticle } from '@/lib/insight-types'
import type { MediaAsset } from '@/lib/media-assets'
import { insightDbNeedsBootstrap, seedInsightsFromShowcaseIfNeeded } from '@/lib/insights-seed-db'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug, normalizeSlugInput, recordSlugHistory } from '@/lib/slug-service'

const INSIGHT_PUBLIC_ID_PREFIX = 'I'

function nextPublicIdFromExisting(values: string[]): string {
  let max = 0
  for (const value of values) {
    const v = value.trim().toUpperCase()
    if (!v.startsWith(INSIGHT_PUBLIC_ID_PREFIX)) continue
    const n = Number.parseInt(v.slice(INSIGHT_PUBLIC_ID_PREFIX.length), 10)
    if (Number.isFinite(n) && n > max) max = n
  }
  return `${INSIGHT_PUBLIC_ID_PREFIX}${max + 1}`
}

function normalizeInsightArticle(input: unknown): InsightArticle | undefined {
  if (!input || typeof input !== 'object') return undefined
  const a = input as InsightArticle
  if (!Array.isArray(a.sections)) return undefined
  return a
}

type InsightDraft = Omit<ShowcaseInsight, 'slug'> & { slug?: string }

function normalizeInsight(input: unknown): InsightDraft | null {
  if (!input || typeof input !== 'object') return null
  const row = input as Record<string, unknown>
  const title = typeof row.title === 'string' ? row.title.trim() : ''
  if (!title) return null
  const id = typeof row.id === 'string' ? row.id.trim() : ''
  const slugRaw = typeof row.slug === 'string' ? row.slug.trim() : ''

  const baseId = id
  const href =
    typeof row.href === 'string' && row.href.trim()
      ? row.href.trim()
      : insightHref(slugRaw || baseId || 'insight')

  const filterIds = Array.isArray(row.filterIds)
    ? row.filterIds.filter((x): x is string => typeof x === 'string')
    : []
  const bodyMode = row.bodyMode === 'simple' || row.bodyMode === 'structured' ? row.bodyMode : undefined
  const simpleBodyHtml = typeof row.simpleBodyHtml === 'string' ? row.simpleBodyHtml : undefined
  const article = normalizeInsightArticle(row.article)

  return {
    id,
    publicId: typeof row.publicId === 'string' ? row.publicId.trim() : '',
    slug: slugRaw || undefined,
    date: typeof row.date === 'string' ? row.date : '',
    dateIso: typeof row.dateIso === 'string' ? row.dateIso : '',
    title,
    description: typeof row.description === 'string' ? row.description : '',
    heroMedia: row.heroMedia && typeof row.heroMedia === 'object' ? (row.heroMedia as MediaAsset) : null,
    mediaAssets: Array.isArray(row.mediaAssets)
      ? (row.mediaAssets as MediaAsset[])
      : row.heroMedia && typeof row.heroMedia === 'object'
        ? [row.heroMedia as MediaAsset]
        : [],
    href,
    filterIds,
    bodyMode,
    simpleBodyHtml,
    article,
  }
}

function toInsightRow(db: {
  id: string
  publicId: string
  slug: string
  date: string
  dateIso: string
  title: string
  description: string
  heroMedia: unknown
  mediaAssets: unknown
  href: string
  filterIds: string[]
  bodyMode: string | null
  simpleBodyHtml: string | null
  article: unknown
}): ShowcaseInsight | null {
  if (!db.slug) return null
  const article = normalizeInsightArticle(db.article)
  return {
    id: db.id,
    publicId: typeof db.publicId === 'string' ? db.publicId : '',
    slug: db.slug,
    date: db.date,
    dateIso: db.dateIso,
    title: db.title,
    description: db.description,
    heroMedia: db.heroMedia && typeof db.heroMedia === 'object' ? (db.heroMedia as MediaAsset) : null,
    mediaAssets: Array.isArray(db.mediaAssets)
      ? (db.mediaAssets as MediaAsset[])
      : db.heroMedia && typeof db.heroMedia === 'object'
        ? [db.heroMedia as MediaAsset]
        : [],
    href: db.href?.trim() || insightHref(db.slug),
    filterIds: migrateCatalogFilterIds(
      Array.isArray(db.filterIds) ? db.filterIds.filter((x): x is string => typeof x === 'string') : [],
    ),
    bodyMode:
      db.bodyMode === 'simple' || db.bodyMode === 'structured' ? db.bodyMode : article ? 'structured' : undefined,
    simpleBodyHtml: db.simpleBodyHtml ?? undefined,
    article,
  }
}

export async function getInsightsFromDb(): Promise<ShowcaseInsight[]> {
  try {
    let rows = await prisma.insight.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    const slugs = rows.map((r) => r.slug.trim()).filter(Boolean)
    if (insightDbNeedsBootstrap(slugs)) {
      await seedInsightsFromShowcaseIfNeeded()
      rows = await prisma.insight.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      })
    }
    return rows.map((row) => toInsightRow(row)).filter((x): x is ShowcaseInsight => x !== null)
  } catch (error) {
    console.error('[insights] getInsightsFromDb failed:', error)
    return []
  }
}

export async function getInsightByIdFromDb(id: string): Promise<ShowcaseInsight | null> {
  const row = await prisma.insight.findUnique({ where: { id } })
  if (!row) return null
  return toInsightRow(row)
}

export async function getInsightBySlugFromDb(slug: string): Promise<ShowcaseInsight | null> {
  const row = await prisma.insight.findUnique({ where: { slug } })
  if (!row) return null
  return toInsightRow(row)
}

export async function createInsightInDb(input: ShowcaseInsight): Promise<ShowcaseInsight | null> {
  const id = input.id?.trim() || createId()
  const existingPublicIds = (await prisma.insight.findMany({ select: { publicId: true } })).map((x) => x.publicId)
  const publicId = input.publicId?.trim() || nextPublicIdFromExisting(existingPublicIds)
  const baseSlug = normalizeSlugInput(input.slug || input.title) || 'insight'
  const slug = await generateUniqueSlug(baseSlug, 'insight', null)
  const href = insightHref(slug)

  try {
    const row = await prisma.insight.create({
      data: {
        id,
        publicId,
        slug,
        date: input.date,
        dateIso: input.dateIso,
        title: input.title,
        description: input.description,
        heroMedia: input.heroMedia as Prisma.InputJsonValue,
        mediaAssets: input.mediaAssets as Prisma.InputJsonValue,
        href,
        filterIds: [...input.filterIds],
        bodyMode: input.bodyMode ?? null,
        simpleBodyHtml: input.simpleBodyHtml ?? null,
        article:
          input.article === undefined || input.article === null
            ? undefined
            : (input.article as Prisma.InputJsonValue),
      },
    })
    return toInsightRow(row)
  } catch (e) {
    console.error('[insights] createInsightInDb failed:', e)
    return null
  }
}

export async function updateInsightByIdInDb(id: string, input: ShowcaseInsight): Promise<ShowcaseInsight | null> {
  const existing = await prisma.insight.findUnique({ where: { id } })
  if (!existing) return null

  const baseSlug = normalizeSlugInput(input.slug || input.title) || existing.slug
  const nextSlug = await generateUniqueSlug(baseSlug, 'insight', id)
  const href = insightHref(nextSlug)

  if (existing.slug !== nextSlug) {
    await recordSlugHistory(id, 'insight', existing.slug)
  }

  try {
    const row = await prisma.insight.update({
      where: { id },
      data: {
        slug: nextSlug,
        publicId: existing.publicId,
        href,
        date: input.date,
        dateIso: input.dateIso,
        title: input.title,
        description: input.description,
        heroMedia: input.heroMedia as Prisma.InputJsonValue,
        mediaAssets: input.mediaAssets as Prisma.InputJsonValue,
        filterIds: [...input.filterIds],
        bodyMode: input.bodyMode ?? null,
        simpleBodyHtml: input.simpleBodyHtml ?? null,
        article:
          input.article === undefined || input.article === null
            ? undefined
            : (input.article as Prisma.InputJsonValue),
      },
    })
    return toInsightRow(row)
  } catch (e) {
    console.error('[insights] updateInsightByIdInDb failed:', e)
    return null
  }
}

export async function deleteInsightByIdFromDb(id: string): Promise<boolean> {
  try {
    await prisma.insight.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export async function saveInsightsToDb(next: ShowcaseInsight[]): Promise<ShowcaseInsight[]> {
  const sanitized = next.map(normalizeInsight).filter((x): x is NonNullable<typeof x> => x !== null)

  const prior = await prisma.insight.findMany()
  const priorById = new Map(prior.map((r) => [r.id, r]))
  const usedPublicIds = new Set(prior.map((r) => r.publicId.trim()).filter(Boolean))

  const resolved: ShowcaseInsight[] = []

  for (const draft of sanitized) {
    const id = draft.id?.trim() ? draft.id.trim() : createId()
    const prev = priorById.get(id)
    const baseSlug = normalizeSlugInput(draft.slug || draft.title || '') || 'insight'
    const slug = await generateUniqueSlug(baseSlug, 'insight', prev ? id : null)
    const href = insightHref(slug)
    if (prev && prev.slug !== slug) await recordSlugHistory(id, 'insight', prev.slug)
    const existingPublicId = prev?.publicId?.trim() || draft.publicId?.trim() || ''
    const publicId = existingPublicId || nextPublicIdFromExisting([...usedPublicIds])
    usedPublicIds.add(publicId)
    resolved.push({
      ...(draft as ShowcaseInsight),
      id,
      publicId,
      slug,
      href,
    })
  }

  const createManyData = resolved.map((row, index) => ({
    id: row.id,
    publicId: row.publicId,
    slug: row.slug,
    date: row.date,
    dateIso: row.dateIso,
    title: row.title,
    description: row.description,
    heroMedia: row.heroMedia as Prisma.InputJsonValue,
    mediaAssets: row.mediaAssets as Prisma.InputJsonValue,
    href: row.href || insightHref(row.slug),
    filterIds: [...row.filterIds],
    bodyMode: row.bodyMode ?? null,
    simpleBodyHtml: row.simpleBodyHtml ?? null,
    article:
      row.article === undefined || row.article === null
        ? undefined
        : (row.article as Prisma.InputJsonValue),
    sortOrder: index,
  }))

  if (createManyData.length === 0) {
    await prisma.insight.deleteMany()
    return []
  }

  await prisma.$transaction([
    prisma.insight.deleteMany(),
    prisma.insight.createMany({ data: createManyData }),
  ])

  return resolved
}
