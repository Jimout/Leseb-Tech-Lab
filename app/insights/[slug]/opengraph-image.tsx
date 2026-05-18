import { ImageResponse } from 'next/og'

import { canonicalInsightSlugForRequestSlug, getInsightDetailBySlug } from '@/lib/insight-detail-data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params
  const canonical = await canonicalInsightSlugForRequestSlug(slug)
  const detail = await getInsightDetailBySlug(canonical)
  const title = detail?.title ?? 'Insight'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0a0a0a 0%, #302e2b 100%)',
          padding: 64,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 600, color: '#facc15', marginBottom: 20 }}>Insight</div>
        <div
          style={{
            fontSize: title.length > 56 ? 38 : 48,
            fontWeight: 700,
            color: '#fafafa',
            lineHeight: 1.15,
            maxWidth: 1050,
          }}
        >
          {title}
        </div>
        {detail?.date ? (
          <div style={{ marginTop: 28, fontSize: 22, color: 'rgba(250,250,250,0.55)' }}>{detail.date}</div>
        ) : null}
      </div>
    ),
    { ...size },
  )
}
