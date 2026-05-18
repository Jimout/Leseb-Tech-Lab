import type { MetadataRoute } from 'next'

import { siteSeoConfig } from '@/lib/seo/site-config'
import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'

const iconPath = '/Leseb-logo.png'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_BRAND_FULL_NAME,
    short_name: siteSeoConfig.handle,
    description: siteSeoConfig.defaultDescription,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    lang: 'en',
    categories: ['technology', 'business', 'productivity'],
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
