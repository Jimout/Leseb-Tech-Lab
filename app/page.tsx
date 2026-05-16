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
import { landingHomeStackGapClass } from '@/lib/landing-page-layout'
import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'
import { cn } from '@/lib/utils'

export const metadata: Metadata = buildPageMetadata({
  title: SITE_BRAND_FULL_NAME,
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
        className={cn(
          'min-h-dvh min-w-0 scroll-mt-24 overflow-x-clip bg-background text-foreground',
          landingHomeStackGapClass,
        )}
      >
        <HeroSection />
        <Marquee />
        <Manifesto />
        <LabSection />
        <WorksSection />
        <ApproachSection />
        <LandingInsightsSection />
        <FooterSection className="pt-0" />
      </main>
      <Toaster />
    </>
  )
}
