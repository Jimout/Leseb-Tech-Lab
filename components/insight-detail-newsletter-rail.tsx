'use client'

import { NewsletterForm } from '@/components/newsletter-form'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  insightDetailNewsletterRailPanelClass,
  insightDetailSansClass,
} from '@/lib/insight-detail-typography'
import {
  landingNewsletterFieldClass,
  landingNewsletterSubmitClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { typeBodySm } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

export function InsightDetailNewsletterRail({ className }: { className?: string }) {
  const { settings } = useSiteSettings()
  const footer = settings.footer
  const line1 = footer.newsletterLine1?.trim() || 'Subscribe for'
  const line2 = footer.newsletterLine2?.trim() || 'new insights'

  return (
    <div className={cn(insightDetailNewsletterRailPanelClass, className)} aria-label="Newsletter signup">
      <p className={cn('mb-3', landingSectionKickerClass)}>
        <span className={landingSectionKickerDotClass} aria-hidden />
        Newsletter
      </p>
      <p className={cn(insightDetailSansClass, typeBodySm, 'mb-4 text-pretty text-foreground/85')}>
        <span className="block font-semibold text-foreground">{line1}</span>
        <span className="block">{line2}</span>
      </p>
      <NewsletterForm
        formClassName="flex flex-col gap-2"
        inputClassName={landingNewsletterFieldClass}
        buttonClassName={cn(landingNewsletterSubmitClass, 'w-full')}
        placeholder="Your email"
      />
    </div>
  )
}
