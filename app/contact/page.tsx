import type { Metadata } from 'next'

import { ContactPageContent } from '@/components/contact-page-content'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { DEFAULT_SITE_SETTINGS } from '@/lib/admin/site-settings'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'

export async function generateMetadata(): Promise<Metadata> {
  const d = DEFAULT_SITE_SETTINGS.contact
  return buildPageMetadata({
    title: d.metaTitle,
    description:
      d.metaDescription ||
      `Get in touch with ${SITE_BRAND_FULL_NAME} for partnerships, product builds, and research enquiries from Addis Ababa.`,
    path: '/contact',
  })
}

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 overflow-x-clip bg-background text-foreground">
        <ContactPageContent />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
