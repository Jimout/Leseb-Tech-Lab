import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { SiteNavbar } from '@/components/site-navbar'
import { HeroSection } from '@/components/hero-section'
import { WorksSection } from '@/components/works-section'
import { InsightsSection } from '@/components/insights-section'
import { DualMarqueeCta } from '@/components/dual-marquee-cta'
import { FooterSection } from '@/components/footer-section'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { siteSeoConfig } from '@/lib/seo/site-config'
import { SITE_BRAND_NAME } from '@/lib/site-brand'

export const metadata: Metadata = buildPageMetadata({
  title: SITE_BRAND_NAME,
  description: siteSeoConfig.defaultDescription,
  path: '/',
  absoluteTitle: true,
})

export default function Home() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }]} />
      <SiteNavbar />
      <main
        id="home"
        className="min-h-dvh min-w-0 scroll-mt-24 overflow-x-clip 2xl:overflow-x-visible text-foreground"
      >
        <HeroSection />
        <WorksSection />
        <DualMarqueeCta />
        <InsightsSection />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
