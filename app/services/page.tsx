import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { ServicesPageContent } from '@/components/services-page-content'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Services',
  description:
    'Human centered AI, web and software development, data platforms, and community driven innovation from Leseb Tech Lab in Addis Ababa.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 overflow-x-clip bg-background text-foreground">
        <ServicesPageContent />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
