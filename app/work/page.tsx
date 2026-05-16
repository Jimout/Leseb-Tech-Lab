import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { Container } from '@/components/layout/container'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'

const WorkPageContent = dynamic(
  () => import('@/components/work-page-content').then((mod) => mod.WorkPageContent),
  {
    loading: () => (
      <section className="pb-10 pt-6 sm:pb-14 sm:pt-8 md:pb-16 md:pt-10 lg:pb-20 lg:pt-12">
        <Container>
          <div className="animate-pulse space-y-4">
            <div className="h-9 w-48 rounded bg-white/10" />
            <div className="h-4 w-72 rounded bg-white/10" />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-64 rounded-2xl bg-white/8" />
              <div className="h-64 rounded-2xl bg-white/8" />
            </div>
          </div>
        </Container>
      </section>
    ),
  },
)

export const metadata: Metadata = buildPageMetadata({
  title: 'Work',
  description:
    'Software, AI, data, and community projects from Leseb Tech Lab — explore the portfolio by practice and filter.',
  path: '/work',
})

export default function WorkPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <WorkPageContent />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
