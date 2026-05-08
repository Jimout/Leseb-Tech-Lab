import { createId } from '@paralleldrive/cuid2'
import type { Prisma } from '@/lib/generated/prisma/client'

import type { WorkRow } from '@/lib/work-admin-types'
import type { MediaAsset } from '@/lib/media-assets'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug, normalizeSlugInput, recordSlugHistory } from '@/lib/slug-service'

const WORK_PUBLIC_ID_PREFIX = 'W'

function nextPublicIdFromExisting(values: string[]): string {
  let max = 0
  for (const value of values) {
    const v = value.trim().toUpperCase()
    if (!v.startsWith(WORK_PUBLIC_ID_PREFIX)) continue
    const n = Number.parseInt(v.slice(WORK_PUBLIC_ID_PREFIX.length), 10)
    if (Number.isFinite(n) && n > max) max = n
  }
  return `${WORK_PUBLIC_ID_PREFIX}${max + 1}`
}

function normalizeWorkRow(input: unknown): (Omit<WorkRow, 'slug'> & { slug?: string }) | null {
  if (!input || typeof input !== 'object') return null
  const row = input as Record<string, unknown>
  const title = typeof row.title === 'string' ? row.title.trim() : ''
  if (!title) return null
  const id = typeof row.id === 'string' ? row.id.trim() : ''
  const slugRaw = typeof row.slug === 'string' ? row.slug.trim() : ''

  return {
    id,
    publicId: typeof row.publicId === 'string' ? row.publicId.trim() : '',
    slug: slugRaw || undefined,
    heroMedia: row.heroMedia && typeof row.heroMedia === 'object' ? (row.heroMedia as MediaAsset) : null,
    mediaAssets: Array.isArray(row.mediaAssets)
      ? (row.mediaAssets as MediaAsset[])
      : row.heroMedia && typeof row.heroMedia === 'object'
        ? [row.heroMedia as MediaAsset]
        : [],
    year: typeof row.year === 'string' ? row.year : '',
    location: typeof row.location === 'string' ? row.location : '',
    title,
    category: typeof row.category === 'string' ? row.category : '',
    filterIds: Array.isArray(row.filterIds) ? row.filterIds.filter((x): x is string => typeof x === 'string') : [],
    detail: row.detail && typeof row.detail === 'object' ? (row.detail as WorkRow['detail']) : undefined,
  }
}

export async function getWorkRowsFromDb(): Promise<WorkRow[]> {
  try {
    const rows = await prisma.work.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return rows
      .map((row) =>
        toWorkRow({
          id: row.id,
          publicId: row.publicId,
          slug: row.slug,
          heroMedia: row.heroMedia as unknown,
          mediaAssets: row.mediaAssets as unknown,
          year: row.year,
          location: row.location,
          title: row.title,
          category: row.category,
          filterIds: row.filterIds,
          detail: row.detail as unknown,
        }),
      )
      .filter((x): x is WorkRow => x !== null)
  } catch (error) {
    console.error('[work-rows] getWorkRowsFromDb failed:', error)
    return []
  }
}

function toWorkRow(inner: Record<string, unknown>): WorkRow | null {
  const id = typeof inner.id === 'string' ? inner.id.trim() : ''
  const slug = typeof inner.slug === 'string' ? inner.slug.trim() : ''
  if (!id || !slug) return null
  return {
    id,
    publicId: typeof inner.publicId === 'string' ? inner.publicId : '',
    slug,
    heroMedia: inner.heroMedia && typeof inner.heroMedia === 'object' ? (inner.heroMedia as MediaAsset) : null,
    mediaAssets: Array.isArray(inner.mediaAssets)
      ? (inner.mediaAssets as MediaAsset[])
      : inner.heroMedia && typeof inner.heroMedia === 'object'
        ? [inner.heroMedia as MediaAsset]
        : [],
    year: typeof inner.year === 'string' ? inner.year : '',
    location: typeof inner.location === 'string' ? inner.location : '',
    title: typeof inner.title === 'string' ? inner.title : '',
    category: typeof inner.category === 'string' ? inner.category : '',
    filterIds: Array.isArray(inner.filterIds)
      ? inner.filterIds.filter((x): x is string => typeof x === 'string')
      : [],
    detail: inner.detail && typeof inner.detail === 'object' ? (inner.detail as WorkRow['detail']) : undefined,
  }
}

export async function getWorkRowByIdFromDb(id: string): Promise<WorkRow | null> {
  const row = await prisma.work.findUnique({ where: { id } })
  if (!row) return null
  return toWorkRow({
    id: row.id,
    publicId: row.publicId,
    slug: row.slug,
    heroMedia: row.heroMedia as unknown,
    mediaAssets: row.mediaAssets as unknown,
    year: row.year,
    location: row.location,
    title: row.title,
    category: row.category,
    filterIds: row.filterIds,
    detail: row.detail as unknown,
  })
}

export async function getWorkRowBySlugFromDb(slug: string): Promise<WorkRow | null> {
  const row = await prisma.work.findUnique({ where: { slug } })
  if (!row) return null
  return toWorkRow({
    id: row.id,
    publicId: row.publicId,
    slug: row.slug,
    heroMedia: row.heroMedia as unknown,
    mediaAssets: row.mediaAssets as unknown,
    year: row.year,
    location: row.location,
    title: row.title,
    category: row.category,
    filterIds: row.filterIds,
    detail: row.detail as unknown,
  })
}

export async function createWorkRowInDb(input: WorkRow): Promise<WorkRow | null> {
  const id = input.id?.trim() || createId()
  const existingPublicIds = (await prisma.work.findMany({ select: { publicId: true } })).map((x) => x.publicId)
  const publicId = input.publicId?.trim() || nextPublicIdFromExisting(existingPublicIds)
  const baseSlug = normalizeSlugInput(input.slug || input.title) || 'work'
  const slug = await generateUniqueSlug(baseSlug, 'work', null)
  try {
    const row = await prisma.work.create({
      data: {
        id,
        publicId,
        slug,
        heroMedia: input.heroMedia as Prisma.InputJsonValue,
        mediaAssets: input.mediaAssets as Prisma.InputJsonValue,
        year: input.year,
        location: input.location,
        title: input.title,
        category: input.category,
        filterIds: [...input.filterIds],
        detail:
          input.detail === undefined || input.detail === null
            ? undefined
            : (input.detail as Prisma.InputJsonValue),
      },
    })
    return (
      toWorkRow({
        id: row.id,
        publicId: row.publicId,
        slug: row.slug,
        heroMedia: row.heroMedia as unknown,
        mediaAssets: row.mediaAssets as unknown,
        year: row.year,
        location: row.location,
        title: row.title,
        category: row.category,
        filterIds: row.filterIds,
        detail: row.detail as unknown,
      }) ?? null
    )
  } catch (e) {
    console.error('[work-rows] createWorkRowInDb failed:', e)
    return null
  }
}

export async function updateWorkRowByIdInDb(id: string, input: WorkRow): Promise<WorkRow | null> {
  const existing = await prisma.work.findUnique({ where: { id } })
  if (!existing) return null

  const baseSlug = normalizeSlugInput(input.slug || input.title) || existing.slug
  const nextSlug = await generateUniqueSlug(baseSlug, 'work', id)
  if (existing.slug !== nextSlug) {
    await recordSlugHistory(id, 'work', existing.slug)
  }

  try {
    const row = await prisma.work.update({
      where: { id },
      data: {
        slug: nextSlug,
        publicId: existing.publicId,
        heroMedia: input.heroMedia as Prisma.InputJsonValue,
        mediaAssets: input.mediaAssets as Prisma.InputJsonValue,
        year: input.year,
        location: input.location,
        title: input.title,
        category: input.category,
        filterIds: [...input.filterIds],
        detail:
          input.detail === undefined || input.detail === null
            ? undefined
            : (input.detail as Prisma.InputJsonValue),
      },
    })
    return (
      toWorkRow({
        id: row.id,
        publicId: row.publicId,
        slug: row.slug,
        heroMedia: row.heroMedia as unknown,
        mediaAssets: row.mediaAssets as unknown,
        year: row.year,
        location: row.location,
        title: row.title,
        category: row.category,
        filterIds: row.filterIds,
        detail: row.detail as unknown,
      }) ?? null
    )
  } catch (e) {
    console.error('[work-rows] updateWorkRowByIdInDb failed:', e)
    return null
  }
}

export async function deleteWorkRowByIdFromDb(id: string): Promise<boolean> {
  try {
    await prisma.work.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export async function saveWorkRowsToDb(nextRows: WorkRow[]): Promise<WorkRow[]> {
  const parsed = nextRows.map(normalizeWorkRow).filter((x): x is NonNullable<typeof x> => x !== null)

  const prior = await prisma.work.findMany()
  const priorById = new Map(prior.map((r) => [r.id, r]))
  const usedPublicIds = new Set(prior.map((r) => r.publicId.trim()).filter(Boolean))

  const resolved: WorkRow[] = []
  for (const draft of parsed) {
    const id = draft.id?.trim() ? draft.id.trim() : createId()
    const prev = priorById.get(id)
    const baseSlug = normalizeSlugInput(draft.slug || draft.title || '') || 'item'
    const slug = await generateUniqueSlug(baseSlug, 'work', prev ? id : null)
    if (prev && prev.slug !== slug) await recordSlugHistory(id, 'work', prev.slug)
    const existingPublicId = prev?.publicId?.trim() || draft.publicId?.trim() || ''
    const publicId = existingPublicId || nextPublicIdFromExisting([...usedPublicIds])
    usedPublicIds.add(publicId)
    resolved.push({
      ...(draft as WorkRow),
      id,
      publicId,
      slug,
    })
  }

  const createManyData = resolved.map((row, index) => ({
    id: row.id,
    publicId: row.publicId,
    slug: row.slug,
    heroMedia: row.heroMedia as Prisma.InputJsonValue,
    mediaAssets: row.mediaAssets as Prisma.InputJsonValue,
    year: row.year,
    location: row.location,
    title: row.title,
    category: row.category,
    filterIds: [...row.filterIds],
    detail:
      row.detail === undefined || row.detail === null
        ? undefined
        : (row.detail as Prisma.InputJsonValue),
    sortOrder: index,
  }))

  if (createManyData.length === 0) {
    await prisma.work.deleteMany()
    return []
  }

  await prisma.$transaction([
    prisma.work.deleteMany(),
    prisma.work.createMany({ data: createManyData }),
  ])

  return resolved
}
