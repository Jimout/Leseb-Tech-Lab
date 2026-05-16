import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact-form'
import { ContactHero } from '@/components/contact-hero'
import { ContactSocialRow } from '@/components/contact-social-row'
import { FooterSection } from '@/components/footer-section'
import { Container } from '@/components/layout/container'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
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
      'Get in touch for collaborations, architectural visualization, interiors, and project enquiries — email, social links, and contact form.',
    path: '/contact',
  })
}

export default async function ContactPage() {
  const { contact } = await getSiteSettingsFromDb()
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <Container>
          <ContactHero />

          <section
            id="contact-form"
            className="scroll-mt-28 pb-16 pt-8 sm:pb-20 sm:pt-10 md:pb-24 md:pt-12 lg:pb-28 lg:pt-14"
          >
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-x-12 xl:gap-x-16 2xl:gap-x-20">
              <div className="max-w-md space-y-8 lg:max-w-lg">
                <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                  {contact.introLine1}
                </p>
                <p className="text-sm leading-relaxed sm:text-base">
                  <span className="text-foreground/80">{contact.introLine2 + ' '} </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-foreground underline decoration-accent decoration-2 underline-offset-[5px] transition-opacity hover:opacity-90"
                  >
                    {contact.email}
                  </a>
                </p>
                {contact.socialVisible ? (
                  <div>
                    <p className="mb-4 text-sm font-medium text-foreground sm:text-base">Follow me on</p>
                    <ContactSocialRow />
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 w-full lg:flex lg:justify-end lg:pl-2 xl:pl-4">
                <ContactForm className="ml-auto w-full max-w-3xl xl:max-w-4xl" />
              </div>
            </div>
          </section>
        </Container>

        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
