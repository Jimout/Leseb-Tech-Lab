'use client'

import Image from 'next/image'

import { containerPaddingClass } from '@/components/layout/container'
import { NewsletterForm } from '@/components/newsletter-form'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  landingNewsletterFieldClass,
  landingNewsletterPanelClass,
  landingNewsletterSubmitClass,
  landingNewsletterTitleClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleAccentClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

const DEFAULT_NEWSLETTER_LOGO = '/Leseb-logo.png'

export type NewsletterSubscribeBannerProps = {
  className?: string
  kicker?: string
  /** Overrides CMS line 1 + 2 when set. */
  heading?: string
  placeholder?: string
}

export function NewsletterSubscribeBanner({
  className,
  kicker = 'Newsletter',
  heading,
  placeholder = 'Your email',
}: NewsletterSubscribeBannerProps) {
  const { settings } = useSiteSettings()
  const footer = settings.footer
  const line1 = footer.newsletterLine1?.trim() || 'Subscribe to'
  const line2 = footer.newsletterLine2?.trim() || 'our newsletter'
  const logoSrc = footer.newsletterBannerSrc?.trim() || DEFAULT_NEWSLETTER_LOGO

  return (
    <section
      className={cn('w-full', className)}
      data-nav-surface="dark"
      aria-labelledby="newsletter-subscribe-banner-heading"
    >
      <div className={cn('mx-auto w-full max-w-none', containerPaddingClass)}>
        <div className={landingNewsletterPanelClass}>
          <div className="flex flex-col gap-10 p-6 sm:p-8 md:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-14 lg:p-12 xl:gap-16 xl:p-14 2xl:p-16">
            <div className="min-w-0 flex-1 space-y-5 lg:space-y-6">
              <div className={landingSectionKickerClass}>
                <span className={landingSectionKickerDotClass} aria-hidden />
                {kicker}
              </div>

              <h2 id="newsletter-subscribe-banner-heading" className={landingNewsletterTitleClass}>
                {heading ? (
                  heading
                ) : (
                  <>
                    <span className="block lg:whitespace-nowrap">{line1}</span>
                    <span className="block lg:whitespace-nowrap">
                      <span className={landingSectionTitleAccentClass}>{line2}</span>
                    </span>
                  </>
                )}
              </h2>

              <NewsletterForm
                formClassName="w-full max-w-full flex-col gap-3 sm:flex-row sm:items-stretch lg:max-w-3xl xl:max-w-4xl"
                inputClassName={landingNewsletterFieldClass}
                buttonClassName={landingNewsletterSubmitClass}
                placeholder={placeholder}
              />
            </div>

            <div className="flex w-full max-w-[min(100%,34rem)] items-end justify-end lg:ml-auto lg:w-[min(100%,34rem)] lg:translate-y-6 xl:translate-y-8 2xl:translate-y-10">
              <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 xl:h-56 xl:w-56 2xl:h-60 2xl:w-60">
                <Image
                  src={logoSrc}
                  alt="Leseb"
                  fill
                  sizes="240px"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
