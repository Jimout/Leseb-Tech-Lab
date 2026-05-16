/**
 * Central site URL and identity for canonical URLs, sitemap, robots, and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-app.vercel.app).
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
  /** Legal / schema name */
  personName: 'Leseb Tech Lab',
  /** Default share title (og:title, twitter:title on home) */
  ogTitle: 'Leseb Tech Lab',
  /** Social / brand handle (no @ in sameAs) */
  handle: 'leseb',
  tagline: 'Technology built for humans',
  jobTitle: 'Technology Lab',
  defaultDescription:
    'Leseb Tech Lab builds software, AI, and product experiences for humans — work, insights, and experiments from Addis Ababa and beyond.',
  keywords: [
    'Leseb',
    'Leseb Tech Lab',
    'technology lab',
    'software',
    'artificial intelligence',
    'product design',
    'human-centered technology',
    'Addis Ababa',
    'Ethiopia',
  ],
  twitterHandle: '@leseb',
  locale: 'en_US',
  sameAs: ['https://www.instagram.com/leseb'] as const,
} as const
