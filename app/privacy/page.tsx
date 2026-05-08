import type { Metadata } from 'next'

import { Container } from '@/components/layout/container'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { FooterSection } from '@/components/footer-section'
import { PrivacyPolicyContent } from '@/components/privacy-policy-content'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How Nattyopia collects, uses, and protects information when you use this portfolio website and contact features.',
  path: '/privacy',
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-page-grid text-foreground">
        <Container className="min-w-0">
          <PrivacyPolicyContent />
        </Container>
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
