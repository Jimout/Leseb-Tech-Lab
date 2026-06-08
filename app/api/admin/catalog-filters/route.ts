// app/api/admin/catalog-filters/route.ts
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import { Prisma } from '@/lib/generated/prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { PortfolioCatalogFilterEntry } from '@/lib/portfolio-catalog-filters'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SETTINGS_ID = 'default'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function slugifyTitle(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeEntry(value: unknown, index: number): PortfolioCatalogFilterEntry | null {
  if (!isRecord(value)) return null

  const id = typeof value.id === 'string' ? value.id.trim() : ''
  const label = typeof value.label === 'string' ? value.label.trim() : ''

  if (!id || !label) return null

  return {
    id,
    label,
    visible: id === 'all' ? true : typeof value.visible === 'boolean' ? value.visible : true,
    order: typeof value.order === 'number' ? value.order : index * 10,
  }
}

function resequenceFilters(entries: PortfolioCatalogFilterEntry[]): PortfolioCatalogFilterEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    order: index * 10,
  }))
}

function sanitizeFilters(value: unknown): PortfolioCatalogFilterEntry[] {
  const rawEntries = Array.isArray(value) ? value : []

  const entries = rawEntries
    .map((entry, index) => normalizeEntry(entry, index))
    .filter((entry): entry is PortfolioCatalogFilterEntry => Boolean(entry))

  // Return empty array if no entries
  if (!entries.length) {
    return []
  }

  const unique = new Map<string, PortfolioCatalogFilterEntry>()

  for (const entry of entries) {
    if (!unique.has(entry.id)) {
      unique.set(entry.id, entry)
    }
  }

  const allEntry = unique.get('all')
  const withoutAll = Array.from(unique.values()).filter((entry) => entry.id !== 'all')

  // If no 'all' and no other entries, return empty
  if (!allEntry && withoutAll.length === 0) {
    return []
  }

  const result = []
  if (allEntry) {
    result.push({
      id: 'all',
      label: allEntry.label,
      visible: true,
      order: 0,
    })
  }

  return resequenceFilters([...result, ...withoutAll])
}

async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  return session
}

async function getSettingsRow() {
  return prisma.globalSiteSettings.upsert({
    where: {
      id: SETTINGS_ID,
    },
    update: {},
    create: {
      id: SETTINGS_ID,
      data: {} as Prisma.InputJsonValue,
    },
  })
}

function getFiltersFromData(data: unknown): PortfolioCatalogFilterEntry[] {
  if (!isRecord(data)) {
    return [] // Empty - no data in database
  }

  // Main location: GlobalSiteSettings.data.portfolioCatalogFilters.workInsights
  const directPortfolioFilters = data.portfolioCatalogFilters

  if (
    isRecord(directPortfolioFilters) &&
    Array.isArray(directPortfolioFilters.workInsights)
  ) {
    const filters = sanitizeFilters(directPortfolioFilters.workInsights)
    return filters.length ? filters : []
  }

  // Fallback: if DB stored { settings: {...} }
  const nestedSettings = data.settings

  if (isRecord(nestedSettings)) {
    const nestedPortfolioFilters = nestedSettings.portfolioCatalogFilters

    if (
      isRecord(nestedPortfolioFilters) &&
      Array.isArray(nestedPortfolioFilters.workInsights)
    ) {
      const filters = sanitizeFilters(nestedPortfolioFilters.workInsights)
      return filters.length ? filters : []
    }
  }

  return [] // Empty - no data found
}

async function saveFiltersToDb(filters: PortfolioCatalogFilterEntry[]) {
  const row = await getSettingsRow()
  const currentData = isRecord(row.data) ? row.data : {}

  // Sanitize and resequence the filters
  const savedFilters = sanitizeFilters(filters)

  const nextData: Record<string, unknown> = {
    ...currentData,
    portfolioCatalogFilters: {
      ...(isRecord(currentData.portfolioCatalogFilters)
        ? currentData.portfolioCatalogFilters
        : {}),
      workInsights: savedFilters,
    },
  }

  // Clean up nested settings if exists
  if (isRecord(nextData.settings)) {
    nextData.settings = {
      ...nextData.settings,
      portfolioCatalogFilters: {
        ...(isRecord(nextData.settings.portfolioCatalogFilters)
          ? nextData.settings.portfolioCatalogFilters
          : {}),
        workInsights: savedFilters,
      },
    }
  }

  const updated = await prisma.globalSiteSettings.update({
    where: {
      id: SETTINGS_ID,
    },
    data: {
      data: nextData as Prisma.InputJsonValue,
    },
  })

  return getFiltersFromData(updated.data)
}

// GET - Fetch all filters
export async function GET() {
  try {
    const row = await getSettingsRow()
    const filters = getFiltersFromData(row.data)

    return NextResponse.json({
      filters,
    })
  } catch (error) {
    console.error('GET /api/admin/catalog-filters:', error)

    return NextResponse.json(
      {
        error: 'Failed to load category filters.',
      },
      { status: 500 },
    )
  }
}

// PUT - Update all filters (bulk update)
export async function PUT(request: NextRequest) {
  const session = await requireAdmin()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!isRecord(body) || !Array.isArray(body.filters)) {
      return NextResponse.json(
        {
          error: 'Invalid filters payload.',
        },
        { status: 400 },
      )
    }

    const savedFilters = await saveFiltersToDb(body.filters)

    return NextResponse.json({
      filters: savedFilters,
    })
  } catch (error) {
    console.error('PUT /api/admin/catalog-filters:', error)

    return NextResponse.json(
      {
        error: 'Failed to save category filters.',
      },
      { status: 500 },
    )
  }
}

// POST - Add a new category
export async function POST(request: NextRequest) {
  const session = await requireAdmin()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          error: 'Invalid request body.',
        },
        { status: 400 },
      )
    }

    const label = typeof body.label === 'string' ? body.label.trim() : ''

    if (!label) {
      return NextResponse.json(
        {
          error: 'Category label is required.',
        },
        { status: 400 },
      )
    }

    const row = await getSettingsRow()
    const currentFilters = getFiltersFromData(row.data)

    // Generate unique ID from label
    const base = slugifyTitle(label) || 'filter'
    let id = base
    let counter = 1

    while (currentFilters.some((entry) => entry.id === id)) {
      id = `${base}-${counter}`
      counter += 1
    }

    // Create new filter entry
    const newFilter: PortfolioCatalogFilterEntry = {
      id,
      label,
      visible: true,
      order: currentFilters.length * 10,
    }

    // Add to existing filters
    const nextFilters = [...currentFilters, newFilter]
    const savedFilters = await saveFiltersToDb(nextFilters)

    return NextResponse.json({
      filters: savedFilters,
    })
  } catch (error) {
    console.error('POST /api/admin/catalog-filters:', error)

    return NextResponse.json(
      {
        error: 'Failed to add category filter.',
      },
      { status: 500 },
    )
  }
}

// DELETE - Remove a category by ID
export async function DELETE(request: NextRequest) {
  const session = await requireAdmin()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        {
          error: 'Category ID is required.',
        },
        { status: 400 },
      )
    }

    // Prevent deletion of 'all' category
    if (id === 'all') {
      return NextResponse.json(
        {
          error: 'Cannot delete the "Explore all" category.',
        },
        { status: 400 },
      )
    }

    const row = await getSettingsRow()
    const currentFilters = getFiltersFromData(row.data)

    // Filter out the category to delete
    const nextFilters = currentFilters.filter((entry) => entry.id !== id)

    if (nextFilters.length === currentFilters.length) {
      return NextResponse.json(
        {
          error: 'Category not found.',
        },
        { status: 404 },
      )
    }

    const savedFilters = await saveFiltersToDb(nextFilters)

    return NextResponse.json({
      filters: savedFilters,
    })
  } catch (error) {
    console.error('DELETE /api/admin/catalog-filters:', error)

    return NextResponse.json(
      {
        error: 'Failed to delete category filter.',
      },
      { status: 500 },
    )
  }
}

// PATCH - Update a single category (toggle visibility, update label, etc.)
export async function PATCH(request: NextRequest) {
  const session = await requireAdmin()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          error: 'Invalid request body.',
        },
        { status: 400 },
      )
    }

    const id = typeof body.id === 'string' ? body.id.trim() : ''

    if (!id) {
      return NextResponse.json(
        {
          error: 'Category ID is required.',
        },
        { status: 400 },
      )
    }

    // Prevent updating 'all' visibility (must always be visible)
    if (id === 'all' && body.visible === false) {
      return NextResponse.json(
        {
          error: 'Cannot hide the "Explore all" category.',
        },
        { status: 400 },
      )
    }

    const row = await getSettingsRow()
    const currentFilters = getFiltersFromData(row.data)

    // Find and update the category
    let found = false
    const nextFilters = currentFilters.map((entry) => {
      if (entry.id === id) {
        found = true
        return {
          ...entry,
          label: typeof body.label === 'string' ? body.label.trim() : entry.label,
          visible: typeof body.visible === 'boolean' ? body.visible : entry.visible,
        }
      }
      return entry
    })

    if (!found) {
      return NextResponse.json(
        {
          error: 'Category not found.',
        },
        { status: 404 },
      )
    }

    const savedFilters = await saveFiltersToDb(nextFilters)

    return NextResponse.json({
      filters: savedFilters,
    })
  } catch (error) {
    console.error('PATCH /api/admin/catalog-filters:', error)

    return NextResponse.json(
      {
        error: 'Failed to update category filter.',
      },
      { status: 500 },
    )
  }
}