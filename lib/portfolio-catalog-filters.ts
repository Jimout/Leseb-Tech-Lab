import { migrateCatalogFilterIds } from '@/lib/catalog-filter-ids'
import type { WorkFilterDefinition } from '@/lib/work-filter-definition'
import { DEFAULT_WORK_CATALOG_FILTER_SEEDS } from '@/lib/works-catalog-seeds'

export type PortfolioCatalogFilterEntry = {
  id: string
  label: string
  visible: boolean
  order: number
}

export type SitePortfolioCatalogFilters = {
  /** Shared taxonomy for `/work` and `/insights` filter bars. */
  workInsights: PortfolioCatalogFilterEntry[]
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

// This should only be used as a fallback when database is empty
export function getDefaultPortfolioCatalogFilters(): SitePortfolioCatalogFilters {
  return {
    workInsights: [], // Return empty array instead of default seeds
  }
}

function parseEntry(raw: unknown, index: number, allId: string): PortfolioCatalogFilterEntry | null {
  if (!isPlainObject(raw)) return null
  const id = typeof raw.id === 'string' ? raw.id.trim() : ''
  if (!id) return null
  const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : id
  const visible = id === allId ? true : raw.visible !== false
  const order = typeof raw.order === 'number' && Number.isFinite(raw.order) ? raw.order : index * 10
  return { id, label, visible, order }
}

/**
 * Normalize a stored filter list: ensure `all` exists, dedupe ids, sort by order.
 * If storage is empty, return empty array (no defaults).
 */
export function normalizeCatalogEntryList(
  stored: unknown,
  fallbackDefaults: PortfolioCatalogFilterEntry[],
  allId: string,
  allLabelFallback: string,
): PortfolioCatalogFilterEntry[] {
  // Return empty array if no stored data
  if (!Array.isArray(stored) || stored.length === 0) {
    return [] // Return empty instead of fallback defaults
  }

  const parsed = stored
    .map((e, i) => parseEntry(e, i, allId))
    .filter((e): e is PortfolioCatalogFilterEntry => Boolean(e))

  let list = parsed
  
  // Only add 'all' if there are other categories or if 'all' exists in stored data
  const hasAll = list.some((e) => e.id === allId)
  const hasOthers = list.some((e) => e.id !== allId)
  
  if (!hasAll && hasOthers) {
    list = [
      {
        id: allId,
        label: allLabelFallback,
        visible: true,
        order: -1000,
      },
      ...list,
    ]
  }

  const seen = new Set<string>()
  list = list.filter((e) => {
    if (seen.has(e.id)) return false
    seen.add(e.id)
    return true
  })

  return list.map((e) => (e.id === allId ? { ...e, visible: true } : e)).sort((a, b) => a.order - b.order)
}

export function normalizePortfolioCatalogFiltersState(raw: unknown): SitePortfolioCatalogFilters {
  const def = getDefaultPortfolioCatalogFilters()
  if (!isPlainObject(raw)) return def
  return {
    workInsights: normalizeCatalogEntryList(
      raw.workInsights,
      def.workInsights,
      'all',
      'Explore all',
    ),
  }
}

export function buildWorkInsightFilterDefinitions(
  entries: PortfolioCatalogFilterEntry[] | undefined,
  items: readonly { filterIds: readonly string[] }[],
): WorkFilterDefinition[] {
  const list = entries && entries.length > 0 ? entries : []
  const migratedItems = items.map((it) => ({
    filterIds: migrateCatalogFilterIds(it.filterIds),
  }))
  
  if (list.length === 0) {
    return []
  }
  
  return list
    .filter((e) => e.visible)
    .map((e) => ({
      id: e.id,
      label: e.label,
      count:
        e.id === 'all'
          ? migratedItems.length
          : migratedItems.filter((it) => it.filterIds.includes(e.id)).length,
    }))
}

export function buildWorkInsightFilterChecklistOptions(
  entries: PortfolioCatalogFilterEntry[] | undefined,
): { id: string; label: string }[] {
  // Return empty array if no entries
  if (!entries || entries.length === 0) {
    return []
  }
  
  // Filter out 'all' category and return only valid categories
  return entries
    .filter((e) => e.id !== 'all' && e.visible !== false)
    .map((e) => ({ id: e.id, label: e.label }))
}