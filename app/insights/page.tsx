import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { Container } from '@/components/layout/container'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'

const InsightsPageContent = dynamic(
  () => import('@/components/insights-page-content').then((mod) => mod.InsightsPageContent),
  {
    loading: () => (
      <section className="pb-12 pt-6 sm:pb-16 sm:pt-8 md:pb-20 md:pt-10 lg:pb-24 lg:pt-12">
        <Container>
          <div className="animate-pulse space-y-4">
            <div className="h-9 w-52 rounded bg-white/10" />
            <div className="h-4 w-80 rounded bg-white/10" />
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="h-60 rounded-2xl bg-white/8" />
              <div className="h-60 rounded-2xl bg-white/8" />
            </div>
          </div>
        </Container>
      </section>
    ),
  },
)

export const metadata: Metadata = buildPageMetadata({
  title: 'Insights',
  description:
    'Articles and notes on architecture, visualization, and design — filter by topic and read in-depth insights.',
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
      <main className="min-h-dvh scroll-mt-24 bg-page-grid text-foreground">
        <InsightsPageContent />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
