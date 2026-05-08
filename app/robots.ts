import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/seo/site-config'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  let host: string | undefined
  try {
    host = new URL(base).host
  } catch {
    host = undefined
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/adminopia', '/adminopia/', '/api', '/api/'],
      },
    ],
    host,
    sitemap: `${base}/sitemap.xml`,
  }
}
