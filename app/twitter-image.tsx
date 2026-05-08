import { ImageResponse } from 'next/og'

import { SITE_BRAND_NAME } from '@/lib/site-brand'
import { siteSeoConfig } from '@/lib/seo/site-config'

/** Default Twitter / X card — matches `/opengraph-image` branding site-wide. */
export const alt = SITE_BRAND_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0a0a0b 0%, #1a1a1c 50%, #0a0a0b 100%)',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: '#facc15',
            marginBottom: 16,
          }}
        >
          {siteSeoConfig.handle}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '#fafafa',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 900,
            padding: '0 48px',
          }}
        >
          {SITE_BRAND_NAME}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: 'rgba(250,250,250,0.72)',
          }}
        >
          {siteSeoConfig.jobTitle}
        </div>
      </div>
    ),
    { ...size },
  )
}
