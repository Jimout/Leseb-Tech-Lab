import { NextResponse } from 'next/server'

import { Prisma } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { normalizePortfolioCatalogFiltersState } from '@/lib/portfolio-catalog-filters'

export const dynamic = 'force-dynamic'

const SETTINGS_ID = 'default'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizePortfolioCatalogFilters(value: unknown) {
  const normalized = normalizePortfolioCatalogFiltersState(value)

  if (!isRecord(value)) {
    return normalized
  }

  const workInsights = Array.isArray(value.workInsights)
    ? value.workInsights
        .filter(isRecord)
        .map((entry, index) => ({
          id: typeof entry.id === 'string' && entry.id.trim() ? entry.id.trim() : `filter-${index}`,
          label:
            typeof entry.label === 'string' && entry.label.trim()
              ? entry.label.trim()
              : `Filter ${index + 1}`,
          visible: typeof entry.visible === 'boolean' ? entry.visible : true,
          order: typeof entry.order === 'number' ? entry.order : index * 10,
        }))
    : [] // Empty array - no defaults

  // Don't force add 'all' filter - only use what's provided
  return {
    ...normalized,
    workInsights,
  }
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

export async function GET() {
  try {
    const row = await getSettingsRow()

    const data = isRecord(row.data) ? row.data : {}

    return NextResponse.json({
      settings: {
        ...data,
        portfolioCatalogFilters: sanitizePortfolioCatalogFilters(data.portfolioCatalogFilters),
      },
      updatedAt: row.updatedAt,
    })
  } catch (error) {
    console.error('[ADMIN_SITE_SETTINGS_GET]', error)

    return NextResponse.json(
      {
        error: 'Failed to load site settings.',
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    console.log('[ADMIN_SITE_SETTINGS_PATCH_BODY]', JSON.stringify(body, null, 2))

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          error: 'Invalid request body.',
        },
        { status: 400 },
      )
    }

    const current = await getSettingsRow()
    const currentData = isRecord(current.data) ? current.data : {}

    const nextData: Record<string, unknown> = {
      ...currentData,
      ...body,
    }

    if ('portfolioCatalogFilters' in body) {
      nextData.portfolioCatalogFilters = sanitizePortfolioCatalogFilters(
        body.portfolioCatalogFilters,
      )
    }

    console.log('[ADMIN_SITE_SETTINGS_NEXT_DATA]', JSON.stringify(nextData, null, 2))

    const updated = await prisma.globalSiteSettings.update({
      where: {
        id: SETTINGS_ID,
      },
      data: {
        data: nextData as Prisma.InputJsonValue,
      },
    })

    const updatedData = isRecord(updated.data) ? updated.data : {}

    console.log('[ADMIN_SITE_SETTINGS_UPDATED_DATA]', JSON.stringify(updatedData, null, 2))

    return NextResponse.json({
      settings: {
        ...updatedData,
        portfolioCatalogFilters: sanitizePortfolioCatalogFilters(
          updatedData.portfolioCatalogFilters,
        ),
      },
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    console.error('[ADMIN_SITE_SETTINGS_PATCH]', error)

    return NextResponse.json(
      {
        error: 'Failed to update site settings.',
      },
      { status: 500 },
    )
  }
}