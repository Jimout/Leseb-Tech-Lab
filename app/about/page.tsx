import type { Metadata } from 'next'

import { AboutEditorialPage } from '@/components/about-editorial-page'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { FooterSection } from '@/components/footer-section'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { DEFAULT_SITE_SETTINGS } from '@/lib/admin/site-settings'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const d = DEFAULT_SITE_SETTINGS.about
  return buildPageMetadata({
    title: d.metaTitle,
    description: d.metaDescription,
    path: '/about',
  })
}

export default function AboutPage() {
  const settings = DEFAULT_SITE_SETTINGS

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 overflow-x-clip bg-background text-foreground">
        <AboutEditorialPage content={settings.aboutEditorial} />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
