/** Legacy architecture-studio taxonomy → Leseb Tech Lab catalog ids. */
export const LEGACY_TO_LESEB_FILTER_ID: Record<string, string> = {
  architecture: 'software',
  interiors: 'software',
  landscape: 'community',
  planning: 'data',
  products: 'software',
  diagrams: 'data',
  visualizations: 'data',
}

export const LEGACY_CATALOG_FILTER_IDS = [
  'architecture',
  'interiors',
  'landscape',
  'planning',
  'products',
  'diagrams',
  'visualizations',
] as const

const LESEB_CATALOG_FILTER_IDS = ['ai', 'software', 'data', 'community', 'research'] as const

/** Map stored content tags to the current Leseb filter ids (deduped, order preserved). */
export function migrateCatalogFilterIds(ids: readonly string[]): string[] {
  const out: string[] = []
  for (const id of ids) {
    const trimmed = id.trim()
    if (!trimmed) continue
    const next = LEGACY_TO_LESEB_FILTER_ID[trimmed] ?? trimmed
    if (!out.includes(next)) out.push(next)
  }
  return out
}

export function isLegacyArchitectureCatalogFilters(entries: readonly { id: string }[]): boolean {
  const ids = new Set(entries.map((e) => e.id))
  return LEGACY_CATALOG_FILTER_IDS.some((legacyId) => ids.has(legacyId)) && !ids.has('ai')
}

export function hasLesebCatalogFilters(entries: readonly { id: string }[]): boolean {
  const ids = new Set(entries.map((e) => e.id))
  return LESEB_CATALOG_FILTER_IDS.some((id) => ids.has(id))
}
