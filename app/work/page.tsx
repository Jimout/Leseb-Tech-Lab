import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { SiteNavbar } from '@/components/site-navbar'
import { ThreeDotsLoader } from '@/components/three-dots-loader'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'

const WorkPageContent = dynamic(
  () => import('@/components/work-page-content').then((mod) => mod.WorkPageContent),
  {
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <ThreeDotsLoader />
      </div>
    ),
  },
)

export const metadata: Metadata = buildPageMetadata({
  title: 'Work',
  description: `Software, AI, data, and community projects from ${SITE_BRAND_FULL_NAME}. Filter by practice and explore case studies.`,
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
