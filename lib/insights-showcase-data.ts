import { migrateCatalogFilterIds } from '@/lib/catalog-filter-ids'
import type { InsightArticle } from '@/lib/insight-types'
import type { MediaAsset } from '@/lib/media-assets'

export type InsightBodyMode = 'simple' | 'structured'

export type ShowcaseInsight = {
  id: string
  /** Short admin-facing id (I1, I2, ...). */
  publicId: string
  /** Public URL segment: `/insights/[slug]` (canonical). */
  slug: string
  date: string
  dateIso: string
  title: string
  description: string
  heroMedia: MediaAsset | null
  mediaAssets: MediaAsset[]
  href: string
  /** Matches `DEFAULT_WORK_FILTERS` ids from `works-filter-menu` (omit `all`). */
  filterIds: readonly string[]
  /** How the detail page renders body (admin). */
  bodyMode?: InsightBodyMode
  /** One HTML document (TipTap) when `bodyMode` is `simple`. */
  simpleBodyHtml?: string
  /** TOC + sections when `bodyMode` is `structured`. */
  article?: InsightArticle
}

export function insightHref(slug: string) {
  return `/insights/${slug}`
}

/** Static catalog seeds; `slug` matches legacy public paths (same string as `id` here). */
type InsightSeed = Omit<ShowcaseInsight, 'publicId' | 'slug' | 'heroMedia' | 'mediaAssets'> & {
  mediaUrl: string
  mediaAlt: string
}

const SHOWCASE_INSIGHT_SEEDS: InsightSeed[] = [
  {
    id: 'sample-intent-to-interface',
    date: 'May 2, 2026',
    dateIso: '2026-05-02',
    title: 'From intent to interface in three sketches',
    description:
      'A workshop format we use to align on flows before pixels—notes, arrows, and one shared vocabulary.',
    mediaUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Team reviewing sketches and wireframes on a desk',
    href: insightHref('sample-intent-to-interface'),
    filterIds: ['software', 'research'],
  },
  {
    id: 'sample-metrics-that-move-teams',
    date: 'April 28, 2026',
    dateIso: '2026-04-28',
    title: 'Metrics that move teams without drowning them',
    description:
      'How we pick a small signal set—latency, completion, satisfaction—and review it in the same slot every week.',
    mediaUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Charts and analytics on a laptop screen',
    href: insightHref('sample-metrics-that-move-teams'),
    filterIds: ['data', 'research'],
  },
  {
    id: 'sample-shipping-in-small-slices',
    date: 'April 18, 2026',
    dateIso: '2026-04-18',
    title: 'Shipping in small slices partners can feel',
    description:
      'Vertical cuts beat horizontal layers when you need feedback early—what we bundle, what we defer, and how we demo.',
    mediaUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Laptop with project planning interface',
    href: insightHref('sample-shipping-in-small-slices'),
    filterIds: ['software', 'ai'],
  },
  {
    id: 'human-ai-with-restraint',
    date: 'March 14, 2026',
    dateIso: '2026-03-14',
    title: 'Human AI with restraint: designing assistants people trust',
    description:
      'How we scope models, defaults, and fallbacks so intelligence removes friction without manufacturing dependence.',
    mediaUrl: '/images/biom.jpg',
    mediaAlt: 'Abstract visualization of human-centered AI',
    href: insightHref('human-ai-with-restraint'),
    filterIds: ['ai', 'research'],
  },
  {
    id: 'product-discovery-in-addis',
    date: 'March 12, 2026',
    dateIso: '2026-03-12',
    title: 'Product discovery in Addis: from field notes to roadmap',
    description:
      'How interviews, prototypes, and bilingual copy converge before we commit engineering weeks.',
    mediaUrl:
      'https://images.unsplash.com/photo-1518005020951-ecc96e9672e7?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Product sketches and sticky notes on a table',
    href: insightHref('product-discovery-in-addis'),
    filterIds: ['software', 'community'],
  },
  {
    id: 'shared-context-before-ship',
    date: 'March 12, 2026',
    dateIso: '2026-03-12',
    title: 'Why shared context is no longer optional before you ship',
    description:
      'Lightweight artifacts—journeys, contracts, telemetry plans—that keep AI and software teams aligned.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Team reviewing a product roadmap on screen',
    href: insightHref('shared-context-before-ship'),
    filterIds: ['software', 'data'],
  },
  {
    id: 'system-sketches-early',
    date: 'February 28, 2026',
    dateIso: '2026-02-28',
    title: 'System sketches before schema migrations',
    description:
      'Quick diagrams that keep data models, APIs, and UI states legible before implementation detail takes over.',
    mediaUrl:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Architecture diagram on a whiteboard',
    href: insightHref('system-sketches-early'),
    filterIds: ['data', 'software'],
  },
  {
    id: 'community-as-requirements',
    date: 'January 15, 2026',
    dateIso: '2026-01-15',
    title: 'Community research as requirements—not decoration',
    description:
      'Field visits and co-design sessions that change what we build, not just the slide deck.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Community workshop with participants around a table',
    href: insightHref('community-as-requirements'),
    filterIds: ['community', 'research'],
  },
  {
    id: 'compact-teams-clear-interfaces',
    date: 'December 4, 2025',
    dateIso: '2025-12-04',
    title: 'Compact teams, clear interfaces',
    description:
      'How we keep navigation shallow and language plain when bandwidth and attention are scarce.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Mobile interface on a bright desk',
    href: insightHref('compact-teams-clear-interfaces'),
    filterIds: ['software', 'community'],
  },
  {
    id: 'platform-details-matter',
    date: 'November 20, 2025',
    dateIso: '2025-11-20',
    title: 'When platform details become the product experience',
    description:
      'Permissions, notifications, and empty states that read as intentional—not backlog leftovers.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600566753080-825a35a0e3aa?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'UI components and design tokens on screen',
    href: insightHref('platform-details-matter'),
    filterIds: ['software', 'ai'],
  },
  {
    id: 'diagrams-for-alignment',
    date: 'October 8, 2025',
    dateIso: '2025-10-08',
    title: 'Diagrams that align engineers and partners in one glance',
    description:
      'Reducing complexity to a few clear moves—what to leave in and what to strip away.',
    mediaUrl:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'System diagram on a desk',
    href: insightHref('diagrams-for-alignment'),
    filterIds: ['data', 'research'],
  },
  {
    id: 'prototype-atmosphere',
    date: 'September 1, 2025',
    dateIso: '2025-09-01',
    title: 'Atmosphere before polish in prototypes',
    description:
      'Setting tone with copy, motion, and defaults before locking visual craft.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Prototype screens with soft gradients',
    href: insightHref('prototype-atmosphere'),
    filterIds: ['software', 'research'],
  },
  {
    id: 'field-research-before-code',
    date: 'August 12, 2025',
    dateIso: '2025-08-12',
    title: 'Reading the field before the first line of code',
    description:
      'Checklists for connectivity, literacy, and local norms that inform architecture before sprints begin.',
    mediaUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Aerial view of a city with mixed infrastructure',
    href: insightHref('field-research-before-code'),
    filterIds: ['community', 'research'],
  },
  {
    id: 'design-systems-under-pressure',
    date: 'July 3, 2025',
    dateIso: '2025-07-03',
    title: 'Design systems that survive tight timelines',
    description:
      'Tokens, components, and documentation that stay useful when scope shifts mid-quarter.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Design system components on a monitor',
    href: insightHref('design-systems-under-pressure'),
    filterIds: ['software', 'data'],
  },
  {
    id: 'review-pipeline-for-teams',
    date: 'June 18, 2025',
    dateIso: '2025-06-18',
    title: 'A simple review pipeline for weekly product check-ins',
    description:
      'Templates, naming, and exports so the team always compares apples to apples.',
    mediaUrl:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Dashboard on a laptop during a review',
    href: insightHref('review-pipeline-for-teams'),
    filterIds: ['data', 'software'],
  },
  {
    id: 'offline-first-patterns',
    date: 'May 9, 2025',
    dateIso: '2025-05-09',
    title: 'Offline-first patterns for unreliable networks',
    description:
      'Queues, conflict resolution, and calm defaults that keep civic tools usable between syncs.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Mobile device in a low-connectivity setting',
    href: insightHref('offline-first-patterns'),
    filterIds: ['community', 'software'],
  },
  {
    id: 'humane-empty-states',
    date: 'April 22, 2025',
    dateIso: '2025-04-22',
    title: 'Humane empty states without the cartoon cliché',
    description:
      'Copy, illustration, and recovery paths that respect context instead of filling space.',
    mediaUrl:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Person using a civic app on a phone',
    href: insightHref('humane-empty-states'),
    filterIds: ['software', 'community'],
  },
]

export const SHOWCASE_INSIGHTS: ShowcaseInsight[] = SHOWCASE_INSIGHT_SEEDS.map((insight, index) => ({
  id: insight.id,
  publicId: `I${index + 1}`,
  slug: insight.id,
  date: insight.date,
  dateIso: insight.dateIso,
  title: insight.title,
  description: insight.description,
  heroMedia: { type: 'image', url: insight.mediaUrl, alt: insight.mediaAlt },
  mediaAssets: [{ type: 'image', url: insight.mediaUrl, alt: insight.mediaAlt }],
  href: insight.href,
  filterIds: migrateCatalogFilterIds(insight.filterIds),
  bodyMode: insight.bodyMode,
  simpleBodyHtml: insight.simpleBodyHtml,
  article: insight.article,
}))
