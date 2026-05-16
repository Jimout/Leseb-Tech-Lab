import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { CATALOG_FILTER_LABEL_BY_ID } from '@/lib/works-catalog-seeds'
import type { ShowcaseWork } from '@/lib/works-showcase-data'

function categoryToTags(category: string, max = 3): string[] {
  return category
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max)
}

function filterIdToProjectType(work: ShowcaseWork): string {
  const first = work.filterIds[0]
  if (!first) return 'Software'
  return CATALOG_FILTER_LABEL_BY_ID[first] ?? 'Project'
}

function resolveRoles(_work: ShowcaseWork): string[] {
  return ['Product design', 'Engineering', 'Research']
}

/** Default meta-bar copy when no custom description is set (also used after localStorage merge fallbacks). */
export function defaultBodyForWork(work: ShowcaseWork): string {
  return `${work.title} brings together product discovery, iterative builds, and delivery aligned with the brief. We focus on clarity, accessibility, and outcomes your users can feel in production.`
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
