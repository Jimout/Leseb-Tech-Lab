/**
 * Canonical ids/labels for Work + Insights catalog filters (no React — safe on server).
 * Aligned with Leseb service pillars: AI, Software, Data, Community (+ Research for insights).
 * Counts for the public UI are always derived from content.
 */
export const DEFAULT_WORK_CATALOG_FILTER_SEEDS = [
  { id: 'all', label: 'Explore all' },
  { id: 'ai', label: 'AI' },
  { id: 'software', label: 'Software' },
  { id: 'data', label: 'Data' },
  { id: 'community', label: 'Community' },
  { id: 'research', label: 'Research' },
] as const

export const CATALOG_FILTER_LABEL_BY_ID: Record<string, string> = Object.fromEntries(
  DEFAULT_WORK_CATALOG_FILTER_SEEDS.map((f) => [f.id, f.label]),
)
