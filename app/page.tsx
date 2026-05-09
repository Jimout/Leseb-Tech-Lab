import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { SiteNavbar } from '@/components/site-navbar'
import { HeroSection } from '@/components/hero-section'
import { ApproachSection } from '@/components/approach-section'
import { WorksSection } from '@/components/works-section'
import { Marquee } from '@/components/marquee'
import { LabSection } from '@/components/lab-section'
import { LandingInsightsSection } from '@/components/landing-insights-section'
import { Manifesto } from '@/components/manifesto'
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
        className="home-page-stack min-h-dvh min-w-0 scroll-mt-24 overflow-x-clip text-foreground"
      >
        <HeroSection />
        <Marquee />
        <Manifesto />
        <LabSection />
        <div className="flex min-h-0 w-full min-w-0 flex-col gap-0">
          <WorksSection />
          <ApproachSection />
          <LandingInsightsSection />
          <FooterSection className="pt-0 sm:pt-0 md:pt-0 lg:pt-0 xl:pt-0 2xl:pt-0 3xl:pt-0 4xl:pt-0" />
        </div>
      </main>
      <Toaster />
    </>
  )
}
