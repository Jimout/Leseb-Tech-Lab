'use client'

import { ContactForm } from '@/components/contact-form'
import { ContactSocialRow } from '@/components/contact-social-row'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  landingPageGutterClass,
  landingSectionInnerClass,
  landingSectionYClass,
} from '@/lib/landing-page-layout'
import {
  landingBodyClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleClass,
} from '@/lib/landing-page-typography'
import { typeLabel } from '@/lib/type-scale'
import { toTelHref } from '@/lib/phone-tel'
import { cn } from '@/lib/utils'

const contactLinkClass =
  'font-medium text-signal underline-offset-4 transition-opacity hover:opacity-85 hover:underline'

export function ContactPageBody() {
  const { settings } = useSiteSettings()
  const contact = settings.contact
  const phone = (contact.phone || settings.footer.phone)?.trim() ?? ''
  const phoneHref = phone ? toTelHref(phone) : ''

  return (
    <section
      id="contact-form"
      data-nav-surface="dark"
      className={cn('scroll-mt-24 bg-background', landingPageGutterClass)}
      aria-labelledby="contact-form-heading"
    >
      <div className={cn(landingSectionInnerClass, landingSectionYClass)}>
        <div className="grid gap-12 md:grid-cols-12 md:gap-10 lg:gap-14 2xl:gap-16 3xl:gap-20 4xl:gap-24">
          <aside className="min-w-0 md:col-span-4">
            <div className={cn('mb-4', landingSectionKickerClass)}>
              <span className={landingSectionKickerDotClass} aria-hidden />
              {contact.sectionKicker}
            </div>
            <h2 id="contact-form-heading" className={cn(landingSectionTitleClass, 'text-3xl sm:text-4xl lg:text-5xl')}>
              {contact.sectionTitle}
            </h2>

            <div className="mt-8 space-y-6 md:mt-10">
              <p className={landingBodyClass}>{contact.introLine1}</p>
              <div className="space-y-3">
                <p className={landingBodyClass}>
                  <span className="text-muted-foreground">{contact.introLine2} </span>
                  <a href={`mailto:${contact.email}`} className={contactLinkClass}>
                    {contact.email}
                  </a>
                </p>
                {phone && phoneHref ? (
                  <p className={landingBodyClass}>
                    <span className="text-muted-foreground">Or call </span>
                    <a href={`tel:${phoneHref}`} className={contactLinkClass}>
                      {phone}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>

            {contact.socialVisible ? (
              <div className="mt-10 border-t border-border pt-8 md:mt-12">
                <p className={cn('mb-4', typeLabel)}>
                  Elsewhere
                </p>
                <ContactSocialRow />
              </div>
            ) : null}
          </aside>

          <div className="min-w-0 md:col-span-8">
            <div className="border border-border bg-box/40 p-6 sm:p-8 md:p-10 lg:p-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
