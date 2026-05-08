/**
 * Canonical ids/labels for Work + Insights catalog filters (no React — safe on server).
 * Counts for the public UI are always derived from content.
 */
export const DEFAULT_WORK_CATALOG_FILTER_SEEDS = [
  { id: 'all', label: 'Explore All' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'planning', label: 'Planning' },
  { id: 'products', label: 'Products' },
  { id: 'diagrams', label: 'Diagrams & Illustrations' },
  { id: 'visualizations', label: 'Visualizations' },
] as const
