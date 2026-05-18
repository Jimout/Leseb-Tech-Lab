import { ImageResponse } from 'next/og'

import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'
import { siteSeoConfig } from '@/lib/seo/site-config'

/** Default Twitter / X card - matches opengraph-image branding site-wide. */
export const alt = SITE_BRAND_FULL_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 0

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
          background: 'linear-gradient(145deg, #0a0a0a 0%, #302e2b 50%, #0a0a0a 100%)',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          padding: '0 64px',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#dfe222',
            marginBottom: 20,
          }}
        >
          {siteSeoConfig.tagline}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#fafafa',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 960,
          }}
        >
          {SITE_BRAND_FULL_NAME}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            lineHeight: 1.4,
            color: 'rgba(250,250,250,0.75)',
            textAlign: 'center',
            maxWidth: 820,
          }}
        >
          {siteSeoConfig.defaultDescription}
        </div>
      </div>
    ),
    { ...size },
  )
}
