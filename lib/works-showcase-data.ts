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
  category: string
  /** Matches `DEFAULT_WORK_FILTERS` ids from `works-filter-menu` (omit `all`). */
  filterIds: readonly string[]
}

type WorkSeed = Omit<ShowcaseWork, 'publicId' | 'slug' | 'heroMedia' | 'mediaAssets'> & {
  mediaUrl: string
  mediaAlt: string
}

const SHOWCASE_WORK_SEEDS: WorkSeed[] = [
  {
    id: 'eih-landscape',
    mediaUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Aerial view of a modern building complex',
    year: '2025',
    location: 'Addis Ababa, Ethiopia',
    title: 'Ethiopian Investment Holdings Head Quarter Landscape',
    category: 'Landscape Design, 3D Modeling, Visualization',
    filterIds: ['landscape', 'planning', 'visualizations'],
  },
  {
    id: 'arch-community-residence',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Residential architecture at dusk with driveway',
    year: '2025',
    location: 'Naples, Italy',
    title: 'Arch Community Residence',
    category: '3D Modeling, Visualization',
    filterIds: ['architecture', 'visualizations'],
  },
  {
    id: 'slim-residence',
    mediaUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Tall narrow classical-style facade',
    year: '2025',
    location: 'Woodstock, England',
    title: 'Slim Residence',
    category: 'Visualization',
    filterIds: ['architecture', 'visualizations'],
  },
  {
    id: 'zoran-residence',
    mediaUrl:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Modern home with pool at twilight',
    year: '2025',
    location: 'Montana, USA',
    title: 'Zoran Residence',
    category: 'Visualization',
    filterIds: ['visualizations'],
  },
  {
    id: 'atrium-office',
    mediaUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Open office atrium with stair',
    year: '2024',
    location: 'Berlin, Germany',
    title: 'Atrium Office Hub',
    category: 'Architecture, Interiors',
    filterIds: ['architecture', 'interiors'],
  },
  {
    id: 'coastal-villa',
    mediaUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Modern villa exterior at golden hour',
    year: '2024',
    location: 'Algarve, Portugal',
    title: 'Coastal Villa Study',
    category: 'Visualization, Planning',
    filterIds: ['architecture', 'visualizations', 'planning'],
  },
  {
    id: 'urban-plaza',
    mediaUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Urban plaza with trees and seating',
    year: '2024',
    location: 'Copenhagen, Denmark',
    title: 'Urban Plaza Diagram',
    category: 'Diagrams & Illustrations, Planning',
    filterIds: ['diagrams', 'planning'],
  },
  {
    id: 'furniture-line',
    mediaUrl:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Minimal furniture in bright room',
    year: '2023',
    location: 'Oslo, Norway',
    title: 'Nordic Seating Series',
    category: 'Products, Interiors',
    filterIds: ['products', 'interiors'],
  },
  {
    id: 'terrace-garden',
    mediaUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Terrace garden with stone path',
    year: '2023',
    location: 'Lyon, France',
    title: 'Terrace Garden Layering',
    category: 'Landscape, Visualization',
    filterIds: ['landscape', 'visualizations'],
  },
  {
    id: 'museum-wing',
    mediaUrl:
      'https://images.unsplash.com/photo-1545558014-8692077e9d5c?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Museum facade with geometric panels',
    year: '2023',
    location: 'Seoul, South Korea',
    title: 'Museum Wing Extension',
    category: 'Architecture, Visualization',
    filterIds: ['architecture', 'visualizations'],
  },
  {
    id: 'loft-interior',
    mediaUrl:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Industrial loft living space',
    year: '2023',
    location: 'Brooklyn, USA',
    title: 'Loft Interior Refresh',
    category: 'Interiors, Visualization',
    filterIds: ['interiors', 'visualizations'],
  },
  {
    id: 'campus-masterplan',
    mediaUrl:
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Aerial campus buildings',
    year: '2022',
    location: 'Nairobi, Kenya',
    title: 'Campus Masterplan',
    category: 'Planning, Diagrams & Illustrations',
    filterIds: ['planning', 'diagrams'],
  },
  {
    id: 'pavilion-product',
    mediaUrl:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Small timber pavilion',
    year: '2022',
    location: 'Helsinki, Finland',
    title: 'Timber Pavilion Prototype',
    category: 'Products, Architecture',
    filterIds: ['products', 'architecture'],
  },
  {
    id: 'night-render',
    mediaUrl:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'House exterior at night with lighting',
    year: '2022',
    location: 'Vancouver, Canada',
    title: 'Night Lighting Study',
    category: 'Visualizations',
    filterIds: ['visualizations'],
  },
  {
    id: 'courtyard-axon',
    mediaUrl:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Architectural drawing on desk',
    year: '2022',
    location: 'Remote',
    title: 'Courtyard Axonometric',
    category: 'Diagrams & Illustrations',
    filterIds: ['diagrams'],
  },
  {
    id: 'riverside-path',
    mediaUrl:
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Park path along river',
    year: '2021',
    location: 'Portland, USA',
    title: 'Riverside Path Strategy',
    category: 'Landscape, Planning',
    filterIds: ['landscape', 'planning'],
  },
  {
    id: 'glass-facade-tower',
    mediaUrl:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Glass curtain wall tower facade',
    year: '2024',
    location: 'Singapore',
    title: 'Glass Facade Tower Study',
    category: 'Architecture, Visualization',
    filterIds: ['architecture', 'visualizations'],
  },
  {
    id: 'boutique-retail',
    mediaUrl:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Retail interior with display shelving',
    year: '2023',
    location: 'Milan, Italy',
    title: 'Boutique Retail Concept',
    category: 'Interiors, Products',
    filterIds: ['interiors', 'products'],
  },
  {
    id: 'wetland-boardwalk',
    mediaUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Foggy wetland with wooden boardwalk',
    year: '2023',
    location: 'Amsterdam, Netherlands',
    title: 'Wetland Boardwalk Phase',
    category: 'Landscape, Planning',
    filterIds: ['landscape', 'planning'],
  },
  {
    id: 'stair-section-detail',
    mediaUrl:
      'https://images.unsplash.com/photo-1503389147-8c3a0257b2e9?auto=format&fit=crop&w=1400&q=80',
    mediaAlt: 'Architectural section drawing detail',
    year: '2022',
    location: 'Studio',
    title: 'Stair Section Detail Set',
    category: 'Diagrams & Illustrations',
    filterIds: ['diagrams', 'architecture'],
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
  filterIds: w.filterIds,
}))
