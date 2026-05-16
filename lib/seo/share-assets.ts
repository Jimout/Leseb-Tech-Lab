/**
 * Bump when share previews (OG/Twitter images or copy) change materially.
 * Appended to default OG image URLs so crawlers fetch a fresh asset.
 */
export const OG_SHARE_CACHE_VERSION = 'leseb-tech-lab-2026-05'

const LEGACY_PORTFOLIO_SEO =
  /natnael|nattyopia|portfolio of|built environment|architecture, interiors, visualization, and insights/i

export function isLegacyPortfolioSeoText(value: string | undefined | null): boolean {
  if (!value?.trim()) return false
  return LEGACY_PORTFOLIO_SEO.test(value.trim())
}

/** Relative path with cache-bust query for Next.js file-based OG routes. */
export function withOgImageCacheBust(path: string): string {
  const base = path.split('?')[0] ?? path
  return `${base}?v=${encodeURIComponent(OG_SHARE_CACHE_VERSION)}`
}

export const defaultOgImagePath = withOgImageCacheBust('/opengraph-image')
