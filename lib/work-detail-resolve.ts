import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { CATALOG_FILTER_LABEL_BY_ID } from '@/lib/works-catalog-seeds'
import { defaultStoryGalleryForWork } from '@/lib/work-detail-story-gallery'
import { defaultStoryVideoForWork } from '@/lib/work-detail-story-video'
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

const SHOWCASE_WEBSITE_URLS: Partial<Record<string, string>> = {
  'selam-os': 'https://leseb.com',
  mesob: 'https://leseb.com',
  atlas: 'https://leseb.com',
}

const SHOWCASE_PROJECT_FACTS: Partial<
  Record<string, { client: string; industry: string; duration: string }>
> = {
  'selam-os': {
    client: 'Leseb Tech Lab',
    industry: 'AI',
    duration: '16 Weeks',
  },
  mesob: {
    client: 'Community partners',
    industry: 'Civic Tech',
    duration: '12 Weeks',
  },
  atlas: {
    client: 'Leseb Tech Lab',
    industry: 'Data',
    duration: '8 Weeks',
  },
}

function resolveProjectFacts(work: ShowcaseWork): {
  client: string
  industry: string
  duration: string
} {
  const seed = SHOWCASE_PROJECT_FACTS[work.slug] ?? SHOWCASE_PROJECT_FACTS[work.id]
  const industry = filterIdToProjectType(work)
  return {
    client: seed?.client ?? 'Leseb Tech Lab',
    industry: seed?.industry ?? industry,
    duration: seed?.duration ?? '12 Weeks',
  }
}

function resolveWebsiteUrl(work: ShowcaseWork): string | undefined {
  return SHOWCASE_WEBSITE_URLS[work.slug] ?? SHOWCASE_WEBSITE_URLS[work.id]
}

const SHOWCASE_STORY_VIDEO_COPY: Partial<
  Record<string, { title: string; description: string }>
> = {
  'selam-os': {
    title: 'Designing for bilingual dialogue',
    description:
      'We prototyped tone, turn taking, and fallback paths so assistants feel natural in Amharic and English, without slowing teams down in production.',
  },
  mesob: {
    title: 'Community signals in the loop',
    description:
      'Workshops and lightweight polls shaped what shipped first: shared calendars, transparent decisions, and tools neighbors could run without a help desk.',
  },
  atlas: {
    title: 'Shared context that scales',
    description:
      'We linked documents, decisions, and search so teams could onboard faster, with retrieval tuned for how people actually ask questions day to day.',
  },
}

function resolveStoryVideoCopy(work: ShowcaseWork): {
  storyVideoTitle: string
  storyVideoDescription: string
} {
  const seed = SHOWCASE_STORY_VIDEO_COPY[work.slug] ?? SHOWCASE_STORY_VIDEO_COPY[work.id]
  return {
    storyVideoTitle: seed?.title ?? 'What we learned',
    storyVideoDescription:
      seed?.description ??
      `A closer look at how ${work.title} came together in the lab: methods, tradeoffs, and what we shipped.`,
  }
}

const SHOWCASE_STORY_GALLERY_COPY: Partial<
  Record<string, { title: string; description: string }>
> = {
  'selam-os': {
    title: 'From lab to launch',
    description:
      'Field tests with native speakers tightened prompts, error copy, and latency budgets before we handed the build to partner teams.',
  },
  mesob: {
    title: 'Keeping decisions visible',
    description:
      'Every release tied back to a community thread so leaders could see who was affected, what changed, and what still needed input.',
  },
  atlas: {
    title: 'Memory that teams trust',
    description:
      'We validated retrieval with real briefs and incident notes so answers stayed grounded, citeable, and safe to share outside the core squad.',
  },
}

function resolveStoryGalleryCopy(work: ShowcaseWork): {
  storyGalleryTitle: string
  storyGalleryDescription: string
} {
  const seed = SHOWCASE_STORY_GALLERY_COPY[work.slug] ?? SHOWCASE_STORY_GALLERY_COPY[work.id]
  return {
    storyGalleryTitle: seed?.title ?? 'Outcomes in the field',
    storyGalleryDescription:
      seed?.description ??
      `How ${work.title} held up after handoff: what teams adopted, what we adjusted, and what mattered most to users.`,
  }
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
    websiteUrl: resolveWebsiteUrl(work),
    storyVideo: defaultStoryVideoForWork(work),
    storyGalleryImages: defaultStoryGalleryForWork(work),
    ...resolveStoryVideoCopy(work),
    ...resolveStoryGalleryCopy(work),
    ...resolveProjectFacts(work),
  }
}
