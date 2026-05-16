import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/seo/site-config'
import { getAllInsightSlugs } from '@/lib/insight-detail-data'
import { getAllWorkSlugs } from '@/lib/work-detail-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const staticPaths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] }[] =
    [
      { path: '/', priority: 1, changeFrequency: 'weekly' },
      { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/work', priority: 0.9, changeFrequency: 'weekly' },
      { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
      { path: '/insights', priority: 0.9, changeFrequency: 'weekly' },
      { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
    ]

  const out: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: path === '/' ? base : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  const now = new Date()

  const workSlugs = await getAllWorkSlugs()
  for (const slug of workSlugs) {
    out.push({
      url: `${base}/work/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    })
  }

  const insightSlugs = await getAllInsightSlugs()
  for (const slug of insightSlugs) {
    out.push({
      url: `${base}/insights/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    })
  }

  return out
}
