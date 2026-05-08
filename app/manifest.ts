import type { MetadataRoute } from 'next'

import { siteSeoConfig } from '@/lib/seo/site-config'
import { SITE_BRAND_NAME } from '@/lib/site-brand'

const iconPath = `/images/${encodeURIComponent('logo-without 1.png')}`

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_BRAND_NAME,
    short_name: siteSeoConfig.handle,
    description: siteSeoConfig.defaultDescription,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0a0a0b',
    theme_color: '#0a0a0b',
    lang: 'en',
    categories: ['design', 'architecture', 'portfolio'],
    icons: [
      {
        src: iconPath,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
