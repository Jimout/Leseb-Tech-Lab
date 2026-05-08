/**
 * Central site URL and identity for canonical URLs, sitemap, robots, and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://nattyopia.com).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  return 'http://localhost:3000'
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  if (!path || path === '/') return base
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export const siteSeoConfig = {
  /** Short primary name for structured data and OG titles */
  personName: 'Natnael Tibebe',
  /** Social / brand handle (no @ in Person sameAs; use full URLs) */
  handle: 'nattyopia',
  jobTitle: 'Architect & Creative Director',
  defaultDescription:
    'Portfolio of Natnael Tibebe (nattyopia)—architecture, interiors, visualization, and insights on the built environment.',
  keywords: [
    'Natnael Tibebe',
    'nattyopia',
    'architect',
    'architecture',
    'architectural visualization',
    'interior design',
    'landscape architecture',
    'BIM',
    'CAD',
    'portfolio',
    'Addis Ababa',
    'Ethiopia',
  ],
  twitterHandle: '@nattyopia',
  locale: 'en_US',
  /** SameAs — add real profiles when available */
  sameAs: [
    'https://www.instagram.com/nattyopia',
  ] as const,
} as const
