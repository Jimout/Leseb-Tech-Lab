import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import type { ShowcaseWork } from '@/lib/works-showcase-data'

/** Mirrors filter ids from `works-filter-menu` — kept here so server code never imports client modules. */
const FILTER_ID_LABEL: Record<string, string> = {
  architecture: 'Architecture',
  interiors: 'Interiors',
  landscape: 'Landscape',
  planning: 'Planning',
  products: 'Products',
  diagrams: 'Diagrams & Illustrations',
  visualizations: 'Visualizations',
}

function categoryToTags(category: string, max = 3): string[] {
  return category
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max)
}

function filterIdToProjectType(work: ShowcaseWork): string {
  const first = work.filterIds[0]
  if (!first) return 'Architecture'
  return FILTER_ID_LABEL[first] ?? 'Architecture'
}

function resolveRoles(_work: ShowcaseWork): string[] {
  return ['Project Designer', 'Architectural Visualizer']
}

/** Default meta-bar copy when no custom description is set (also used after localStorage merge fallbacks). */
export function defaultBodyForWork(work: ShowcaseWork): string {
  return `${work.title} brings together iterative design development, spatial studies, and visualization aligned with the project brief. Materiality, light, and context inform each phase of the work.`
}

/** Default resolution for a card (no static `OVERRIDES`). Used for localStorage-only works. */
export function resolveWorkDetailFromShowcase(work: ShowcaseWork): ResolvedWorkDetail {
  return {
    work,
    pageTitle: work.title,
    pageTitleLines: undefined,
    year: work.year,
    location: work.location,
    tags: categoryToTags(work.category),
    projectType: filterIdToProjectType(work),
    roles: resolveRoles(work),
    body: defaultBodyForWork(work),
    additionalImages: undefined,
    secondaryHeroImage: undefined,
    descriptionNote: undefined,
    descriptionBelowImages: undefined,
    secondaryImageDescriptionColumns: undefined,
    contentBlocks: undefined,
  }
}
