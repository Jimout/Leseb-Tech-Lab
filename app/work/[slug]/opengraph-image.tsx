import { ImageResponse } from 'next/og'

import { canonicalWorkSlugForRequestSlug, getWorkDetailBySlug } from '@/lib/work-detail-data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params
  const canonical = await canonicalWorkSlugForRequestSlug(slug)
  const detail = await getWorkDetailBySlug(canonical)
  const title = detail?.pageTitle ?? 'Work'
  const subtitle = detail?.work?.category ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0a0a0b',
          padding: 64,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 600, color: '#facc15', marginBottom: 20 }}>Work</div>
        <div
          style={{
            fontSize: title.length > 48 ? 44 : 56,
            fontWeight: 700,
            color: '#fafafa',
            lineHeight: 1.12,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ marginTop: 24, fontSize: 24, color: 'rgba(250,250,250,0.65)' }}>{subtitle}</div>
        ) : null}
      </div>
    ),
    { ...size },
  )
}
