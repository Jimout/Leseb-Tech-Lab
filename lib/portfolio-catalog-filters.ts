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

export function getDefaultPortfolioCatalogFilters(): SitePortfolioCatalogFilters {
  return {
    workInsights: DEFAULT_WORK_CATALOG_FILTER_SEEDS.map((f, i) => ({
      id: f.id,
      label: f.label,
      visible: true,
      order: i * 10,
    })),
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
 * If storage is empty, use `fallbackDefaults` (full seed list).
 */
export function normalizeCatalogEntryList(
  stored: unknown,
  fallbackDefaults: PortfolioCatalogFilterEntry[],
  allId: string,
  allLabelFallback: string,
): PortfolioCatalogFilterEntry[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return fallbackDefaults.map((e) => ({ ...e }))
  }

  const parsed = stored
    .map((e, i) => parseEntry(e, i, allId))
    .filter((e): e is PortfolioCatalogFilterEntry => Boolean(e))

  let list = parsed
  if (!list.some((e) => e.id === allId)) {
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
  const def = getDefaultPortfolioCatalogFilters()
  const list = normalizeCatalogEntryList(entries ?? [], def.workInsights, 'all', 'Explore all')
  const migratedItems = items.map((it) => ({
    filterIds: migrateCatalogFilterIds(it.filterIds),
  }))
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
  const def = getDefaultPortfolioCatalogFilters()
  const list = normalizeCatalogEntryList(entries ?? [], def.workInsights, 'all', 'Explore all')
  return list.filter((e) => e.id !== 'all').map((e) => ({ id: e.id, label: e.label }))
}
