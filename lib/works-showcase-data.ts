import { migrateCatalogFilterIds } from '@/lib/catalog-filter-ids'
import type { MediaAsset } from '@/lib/media-assets'

export type ShowcaseWork = {
  /** Internal id (cuid in DB). */
  id: string
  /** Short admin-facing id (W1, W2, ...). */
  publicId: string
  /** Public URL segment: `/work/[slug]`. */
  slug: string
  heroMedia: MediaAsset | null
  mediaAssets: MediaAsset[]
  year: string
  location: string
  title: string
  /** Practice label on lab cards (first segment used when comma-separated). */
  category: string
  /** Tagline on lab cards — matches landing “In the Lab” copy, not city names. */
  cardSummary?: string
  /** Matches `DEFAULT_WORK_FILTERS` ids from `works-filter-menu` (omit `all`). */
  filterIds: readonly string[]
}

type WorkSeed = Omit<ShowcaseWork, 'publicId' | 'slug' | 'heroMedia' | 'mediaAssets'> & {
  mediaUrl: string
  mediaAlt: string
}

/** Featured on the home page “In the Lab” row — order preserved. */
export const LANDING_LAB_WORK_IDS = ['selam-os', 'mesob', 'atlas'] as const

const SHOWCASE_WORK_SEEDS: WorkSeed[] = [
  {
    id: 'selam-os',
    mediaUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Abstract visualization of conversational AI interfaces',
    year: '2026',
    location: 'Addis Ababa, Ethiopia',
    title: 'Selam OS',
    category: 'Conversational AI',
    cardSummary: 'An assistant that speaks your language, literally and culturally.',
    filterIds: ['ai'],
  },
  {
    id: 'mesob',
    mediaUrl: '/images/biom.jpg',
    mediaAlt: 'Community gathering around shared civic technology',
    year: '2026',
    location: 'Addis Ababa, Ethiopia',
    title: 'Mesob',
    category: 'Civic Tech',
    cardSummary: 'Tools that help communities organize, decide, and act together.',
    filterIds: ['community'],
  },
  {
    id: 'atlas',
    mediaUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Team workspace with knowledge systems on screen',
    year: '2026',
    location: 'Addis Ababa, Ethiopia',
    title: 'Atlas',
    category: 'Knowledge Systems',
    cardSummary: 'Structured memory and retrieval so teams can ship with shared context.',
    filterIds: ['data'],
  },
  {
    id: 'lingua-flow',
    mediaUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Multilingual text and speech pipeline on a laptop',
    year: '2026',
    location: 'Addis Ababa, Ethiopia',
    title: 'Lingua Flow',
    category: 'Conversational AI',
    cardSummary: 'Speech and text pipelines tuned for Amharic, Afaan Oromo, and Tigrinya.',
    filterIds: ['ai'],
  },
  {
    id: 'harvest-dashboard',
    mediaUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Data dashboard with charts and KPIs',
    year: '2025',
    location: 'Hawassa, Ethiopia',
    title: 'Harvest Dashboard',
    category: 'Data Platforms',
    cardSummary: 'Operational metrics and field signals in one place for program leads.',
    filterIds: ['data'],
  },
  {
    id: 'field-notes',
    mediaUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Mobile app wireframes on a desk',
    year: '2025',
    location: 'Bahir Dar, Ethiopia',
    title: 'Field Notes',
    category: 'Product Software',
    cardSummary: 'Offline-first capture for enumerators, synced when connectivity returns.',
    filterIds: ['software'],
  },
  {
    id: 'civic-sms',
    mediaUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Phone showing SMS-based civic engagement',
    year: '2025',
    location: 'Dire Dawa, Ethiopia',
    title: 'Civic SMS',
    category: 'Civic Tech',
    cardSummary: 'Two-way SMS so residents can report, vote, and follow up without smartphones.',
    filterIds: ['community'],
  },
  {
    id: 'open-ledger',
    mediaUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Transparent ledger and audit trail on screen',
    year: '2025',
    location: 'Addis Ababa, Ethiopia',
    title: 'Open Ledger',
    category: 'Data Platforms',
    cardSummary: 'Traceable disbursements and receipts for cooperatives and public programs.',
    filterIds: ['data'],
  },
  {
    id: 'maker-studio',
    mediaUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa7a?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Developers pairing on application code',
    year: '2024',
    location: 'Addis Ababa, Ethiopia',
    title: 'Maker Studio',
    category: 'Product Software',
    cardSummary: 'Rapid prototypes and design systems for teams shipping web and mobile.',
    filterIds: ['software'],
  },
  {
    id: 'care-routing',
    mediaUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Health routing interface on a tablet',
    year: '2024',
    location: 'Jimma, Ethiopia',
    title: 'Care Routing',
    category: 'Applied AI',
    cardSummary: 'Triage and referral suggestions grounded in local clinic workflows.',
    filterIds: ['ai'],
  },
  {
    id: 'learn-loop',
    mediaUrl:
      'https://images.unsplash.com/photo-1501504905252-473c47d087b8?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Learning platform with progress tracking',
    year: '2024',
    location: 'Mekelle, Ethiopia',
    title: 'Learn Loop',
    category: 'EdTech',
    cardSummary: 'Adaptive lessons and coach dashboards for cohort-based programs.',
    filterIds: ['software'],
  },
  {
    id: 'village-radio',
    mediaUrl:
      'https://images.unsplash.com/photo-1478737270239-2f2b6a6c6c0e?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Community radio broadcast setup',
    year: '2024',
    location: 'Gondar, Ethiopia',
    title: 'Village Radio',
    category: 'Civic Tech',
    cardSummary: 'Low-bandwidth audio briefings and call-ins for last-mile listeners.',
    filterIds: ['community'],
  },
]

export const SHOWCASE_WORKS: ShowcaseWork[] = SHOWCASE_WORK_SEEDS.map((w) => ({
  id: w.id,
  publicId: w.id,
  slug: w.id,
  heroMedia: { type: 'image', url: w.mediaUrl, alt: w.mediaAlt },
  mediaAssets: [{ type: 'image', url: w.mediaUrl, alt: w.mediaAlt }],
  year: w.year,
  location: w.location,
  title: w.title,
  category: w.category,
  cardSummary: w.cardSummary,
  filterIds: migrateCatalogFilterIds(w.filterIds),
}))

export function getLandingLabWorks(): ShowcaseWork[] {
  return LANDING_LAB_WORK_IDS.map((id) => SHOWCASE_WORKS.find((w) => w.id === id)).filter(
    (w): w is ShowcaseWork => Boolean(w),
  )
}
