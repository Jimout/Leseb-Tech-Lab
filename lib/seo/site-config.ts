/**
 * Central site URL and identity for canonical URLs, sitemap, robots, and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-app.vercel.app).
 */
import {
  SITE_BRAND_FULL_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
} from '@/lib/site-brand'

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
  /** Legal / schema organization name */
  personName: SITE_BRAND_FULL_NAME,
  /** Default share title (og:title, twitter:title on home) */
  ogTitle: SITE_BRAND_FULL_NAME,
  /** Social / brand handle (no @ in sameAs) */
  handle: 'leseb',
  tagline: SITE_TAGLINE,
  jobTitle: 'Technology Lab',
  defaultDescription: SITE_DESCRIPTION,
  keywords: [
    'Leseb',
    'Leseb Tech Lab',
    'technology lab',
    'human-centered AI',
    'software development',
    'product design',
    'data platforms',
    'community technology',
    'Addis Ababa',
    'Ethiopia',
  ],
  twitterHandle: '@leseb',
  locale: 'en_US',
  sameAs: ['https://www.instagram.com/leseb'] as const,
} as const
