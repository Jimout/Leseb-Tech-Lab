import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteNavbar } from '@/components/site-navbar'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { JsonLd } from '@/components/seo/json-ld'
import { SiteLink } from '@/components/seo/site-link'
import { buildDefaultOpenGraph, buildDefaultTwitter } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/seo/site-config'
import { SITE_BRAND_NAME } from '@/lib/site-brand'

const LOGO_SRC = `/images/${encodeURIComponent('logo-without 1.png')}`

const NOT_FOUND_DESCRIPTION =
  'This page is missing or the link is outdated. Explore work, insights, or contact from the homepage.'

const NOT_FOUND_OG_DESCRIPTION =
  'This page is missing or the link is outdated. Explore work, insights, or contact from the homepage.'

export const metadata: Metadata = {
  title: { absolute: `404 | ${SITE_BRAND_NAME}` },
  description: NOT_FOUND_DESCRIPTION,
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  openGraph: {
    ...buildDefaultOpenGraph(),
    title: `Page not found | ${SITE_BRAND_NAME}`,
    description: NOT_FOUND_OG_DESCRIPTION,
  },
  twitter: {
    ...buildDefaultTwitter(),
    title: `Page not found | ${SITE_BRAND_NAME}`,
    description: NOT_FOUND_OG_DESCRIPTION,
  },
}

export default function NotFound() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Page not found',
          description: NOT_FOUND_DESCRIPTION,
          isPartOf: { '@type': 'WebSite', name: SITE_BRAND_NAME, url: getSiteUrl() },
        }}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <article className="mx-auto grid max-w-5xl gap-12 border border-white/10 bg-background/15 px-6 py-10 backdrop-blur-[2px] sm:px-10 sm:py-12 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16 lg:px-14 lg:py-16">
            <div className="min-w-0">
              <Link
                href="/"
                className="relative mb-8 inline-block h-9 w-30 shrink-0 sm:mb-10 sm:h-10 sm:w-34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label={`${SITE_BRAND_NAME} — home`}
              >
                <Image
                  src={LOGO_SRC}
                  alt=""
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 120px, 140px"
                  priority
                />
              </Link>
              <p className="text-[clamp(4.25rem,16vw,10.5rem)] font-semibold leading-none tracking-[-0.06em] text-white/92">
                404
              </p>
              <div className="mt-6 h-px w-20 bg-white/20" aria-hidden />
              <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Page Not Found
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                The page you&apos;re looking for may have been moved, renamed, or no longer exists.
              </p>
            </div>

            <div className="min-w-0 border-t border-white/10 pt-7 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">Continue Browsing</p>
              <nav className="mt-5 flex flex-col gap-3" aria-label="Helpful links">
                <Button asChild size="lg" className="justify-between">
                  <SiteLink href="/">
                    Return Home
                    <span aria-hidden>→</span>
                  </SiteLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="justify-between border border-white/10 bg-white/8 text-white hover:bg-white/14"
                >
                  <SiteLink href="/work">
                    View Projects
                    <span aria-hidden>→</span>
                  </SiteLink>
                </Button>
              </nav>
              <p className="mt-6 text-sm text-white/60">
                Need to discuss a project?{' '}
                <Link
                  href="/contact"
                  className="font-medium text-white underline underline-offset-4 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  Contact
                </Link>
              </p>
            </div>
          </article>
        </Container>
      </main>
    </>
  )
}
