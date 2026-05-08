import type { Metadata } from 'next'

import { AboutAssociatedVentures } from '@/components/about-associated-ventures'
import { AboutPageContent } from '@/components/about-page-content'
import { AboutProfessionalJourney } from '@/components/about-professional-journey'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { DEFAULT_SITE_SETTINGS } from '@/lib/admin/site-settings'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteSettingsFromDb } from '@/lib/site-settings-db'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettingsFromDb()
  const d = DEFAULT_SITE_SETTINGS.about
  return buildPageMetadata({
    title: s.about.metaTitle?.trim() || d.metaTitle,
    description:
      s.about.metaDescription?.trim() ||
      d.metaDescription ||
      'Architect focused on design development, interiors, and visualization across multiple scales — professional journey, tools, and ventures.',
    path: '/about',
  })
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-page-grid text-foreground">
        <AboutPageContent />
        <AboutProfessionalJourney />
        <AboutAssociatedVentures />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
