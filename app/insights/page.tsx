import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { SiteNavbar } from '@/components/site-navbar'
import { ThreeDotsLoader } from '@/components/three-dots-loader'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'

const InsightsPageContent = dynamic(
  () => import('@/components/insights-page-content').then((mod) => mod.InsightsPageContent),
  {
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <ThreeDotsLoader />
      </div>
    ),
  },
)

export const metadata: Metadata = buildPageMetadata({
  title: 'Insights',
  description:
    'Articles and notes on product, AI, data, and community work — filter by topic and read in-depth insights.',
  path: '/insights',
})

export default function InsightsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <InsightsPageContent />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
