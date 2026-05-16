import type { Metadata } from 'next'

import { ContactPageContent } from '@/components/contact-page-content'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { DEFAULT_SITE_SETTINGS } from '@/lib/admin/site-settings'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteSettingsFromDb } from '@/lib/site-settings-db'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettingsFromDb()
  const d = DEFAULT_SITE_SETTINGS.contact
  return buildPageMetadata({
    title: s.contact.metaTitle?.trim() || d.metaTitle,
    description:
      s.contact.metaDescription?.trim() ||
      d.metaDescription ||
      'Get in touch with Leseb Tech Lab for partnerships, product builds, and research enquiries from Addis Ababa.',
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
