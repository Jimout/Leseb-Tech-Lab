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
import { SITE_BRAND_NAME } from '@/lib/site-brand'
import { typeBodySm } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

const DEFAULT_NEWSLETTER_LOGO = '/Leseb-logo.png'

const DEFAULT_INSIGHTS_NEWSLETTER_DESCRIPTION =
  'New essays and studio thinking, sent only when we have something worth sharing.'

export type NewsletterSubscribeBannerProps = {
  className?: string
  kicker?: string
  /** Overrides CMS line 1 + 2 when set. */
  heading?: string
  placeholder?: string
  /** Short line beside the signup on the insights listing page */
  description?: string
}

export function NewsletterSubscribeBanner({
  className,
  kicker = 'Newsletter',
  heading,
  placeholder = 'Your email',
  description = DEFAULT_INSIGHTS_NEWSLETTER_DESCRIPTION,
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
          <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16">
            <div
              className="pointer-events-none absolute right-8 top-8 sm:right-10 sm:top-10 lg:right-12 lg:top-12 xl:right-14 xl:top-14"
              aria-label={SITE_BRAND_NAME}
            >
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12">
                <Image
                  src={logoSrc}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain object-right-top"
                />
              </div>
            </div>

            <div className="min-w-0 space-y-5 pr-12 sm:space-y-6 sm:pr-14 lg:pr-[4.5rem]">
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
                formClassName="w-full min-w-0 max-w-[18rem] flex-col gap-3 sm:max-w-[22rem] sm:flex-row sm:items-stretch md:max-w-[26rem]"
                inputClassName={landingNewsletterFieldClass}
                buttonClassName={landingNewsletterSubmitClass}
                placeholder={placeholder}
              />

              <aside className="w-full max-w-[18rem] sm:absolute sm:bottom-10 sm:right-10 sm:z-10 sm:w-auto sm:max-w-[14rem] lg:bottom-12 lg:right-12 lg:max-w-[16rem] xl:bottom-14 xl:right-14 xl:max-w-[18rem]">
                <p
                  className={cn(
                    typeBodySm,
                    'text-pretty text-left leading-relaxed text-muted-foreground sm:text-right sm:text-base',
                  )}
                >
                  {description}
                </p>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
