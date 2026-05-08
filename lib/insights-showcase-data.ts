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
    id: 'biomimicry-architecture',
    date: 'March 14, 2026',
    dateIso: '2026-03-14',
    title: 'Biomimicry Architecture: Learning from nature, Designing the future',
    description:
      'Nature has already solved problems of structure, cooling, and adaptation—architecture can borrow those logics without pastiche.',
    mediaUrl: '/images/biom.jpg',
    mediaAlt: 'Biomimicry architecture visualization—organic structure and light',
    href: insightHref('biomimicry-architecture'),
    filterIds: ['architecture', 'planning'],
  },
  {
    id: 'design-thinking',
    date: 'March 12, 2026',
    dateIso: '2026-03-12',
    title: 'From concept to clarity how I approach design thinking',
    description:
      'A look into my process—how ideas evolve into spaces through sketches, iteration, and visualization.',
    mediaUrl:
      'https://images.unsplash.com/photo-1518005020951-ecc96e9672e7?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'White architectural study model on a work surface',
    href: insightHref('design-thinking'),
    filterIds: ['architecture', 'diagrams'],
  },
  {
    id: 'visualization-optional',
    date: 'March 12, 2026',
    dateIso: '2026-03-12',
    title: 'Why visualization is no longer optional in Architecture',
    description:
      'Clients expect to see the story early. Here is how rendering shapes decisions before a site is touched.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Modern residential architecture with wood and glass',
    href: insightHref('visualization-optional'),
    filterIds: ['architecture', 'visualizations'],
  },
  {
    id: 'massing-studies',
    date: 'February 28, 2026',
    dateIso: '2026-02-28',
    title: 'Form, light, and material in early massing studies',
    description:
      'Quick massing exercises that keep the big moves legible before detail and documentation take over.',
    mediaUrl:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Abstract building forms and warm-toned structure',
    href: insightHref('massing-studies'),
    filterIds: ['architecture', 'planning'],
  },
  {
    id: 'landscape-structure',
    date: 'January 15, 2026',
    dateIso: '2026-01-15',
    title: 'Landscape as structure—not only decoration',
    description:
      'Integrating terrain, planting, and paths so outdoor space reads as part of the architectural idea.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Facade and landscape in soft daylight',
    href: insightHref('landscape-structure'),
    filterIds: ['landscape', 'planning'],
  },
  {
    id: 'interior-light',
    date: 'December 4, 2025',
    dateIso: '2025-12-04',
    title: 'Daylight and volume in compact interior plans',
    description:
      'How ceiling height, openings, and material tone stretch perceived space without adding area.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Bright interior with tall windows',
    href: insightHref('interior-light'),
    filterIds: ['interiors', 'architecture'],
  },
  {
    id: 'product-detail',
    date: 'November 20, 2025',
    dateIso: '2025-11-20',
    title: 'Detailing fixtures as part of the spatial idea',
    description:
      'When hardware and lighting read as architecture, not afterthought.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600566753080-825a35a0e3aa?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Interior detail with fixtures',
    href: insightHref('product-detail'),
    filterIds: ['products', 'interiors'],
  },
  {
    id: 'diagram-communication',
    date: 'October 8, 2025',
    dateIso: '2025-10-08',
    title: 'Diagrams that convince clients in one glance',
    description:
      'Reducing complexity to a few clear moves—what to leave in and what to strip away.',
    mediaUrl:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Architectural drawing on desk',
    href: insightHref('diagram-communication'),
    filterIds: ['diagrams', 'planning'],
  },
  {
    id: 'viz-atmosphere',
    date: 'September 1, 2025',
    dateIso: '2025-09-01',
    title: 'Atmosphere before resolution in visualization',
    description:
      'Setting mood with light and material before locking camera and entourage.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Rendered interior atmosphere',
    href: insightHref('viz-atmosphere'),
    filterIds: ['visualizations', 'interiors'],
  },
  {
    id: 'site-planning',
    date: 'August 12, 2025',
    dateIso: '2025-08-12',
    title: 'Reading the site before the first line',
    description:
      'Checklists for slope, access, and views that inform massing before design weeks begin.',
    mediaUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Aerial view of urban context',
    href: insightHref('site-planning'),
    filterIds: ['planning', 'landscape'],
  },
  {
    id: 'material-palette',
    date: 'July 3, 2025',
    dateIso: '2025-07-03',
    title: 'Building a material palette that survives value engineering',
    description:
      'How to lock in character early with alternates that still read as the same idea.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Material samples and wood tones on a table',
    href: insightHref('material-palette'),
    filterIds: ['architecture', 'interiors'],
  },
  {
    id: 'render-pipeline',
    date: 'June 18, 2025',
    dateIso: '2025-06-18',
    title: 'A simple render pipeline for weekly design reviews',
    description:
      'Templates, naming, and exports so the team always compares apples to apples.',
    mediaUrl:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Computer screen with architectural visualization',
    href: insightHref('render-pipeline'),
    filterIds: ['visualizations', 'diagrams'],
  },
  {
    id: 'courtyard-typology',
    date: 'May 9, 2025',
    dateIso: '2025-05-09',
    title: 'Courtyard typologies for hot climates',
    description:
      'Depth, shade, and cross-ventilation patterns that keep outdoor rooms usable year-round.',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'Courtyard with planting and shaded seating',
    href: insightHref('courtyard-typology'),
    filterIds: ['architecture', 'planning', 'landscape'],
  },
  {
    id: 'scale-figures',
    date: 'April 22, 2025',
    dateIso: '2025-04-22',
    title: 'Scale figures without the cartoon cliché',
    description:
      'Silhouettes and entourage that read as spatial reference, not decoration.',
    mediaUrl:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    mediaAlt: 'People walking near a building facade for scale',
    href: insightHref('scale-figures'),
    filterIds: ['diagrams', 'visualizations'],
  },
]

export const SHOWCASE_INSIGHTS: ShowcaseInsight[] = SHOWCASE_INSIGHT_SEEDS.map((insight) => ({
  id: insight.id,
  publicId: insight.id,
  slug: insight.id,
  date: insight.date,
  dateIso: insight.dateIso,
  title: insight.title,
  description: insight.description,
  heroMedia: { type: 'image', url: insight.mediaUrl, alt: insight.mediaAlt },
  mediaAssets: [{ type: 'image', url: insight.mediaUrl, alt: insight.mediaAlt }],
  href: insight.href,
  filterIds: insight.filterIds,
  bodyMode: insight.bodyMode,
  simpleBodyHtml: insight.simpleBodyHtml,
  article: insight.article,
}))
