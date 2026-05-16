'use client'

import { NewsletterForm } from '@/components/newsletter-form'
import {
  footerNewsletterFieldClass,
  footerNewsletterSubmitClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export type FooterNewsletterSubscribeProps = {
  className?: string
}

/** Footer contact column: email input + subscribe button only. */
export function FooterNewsletterSubscribe({ className }: FooterNewsletterSubscribeProps) {
  return (
    <div className={cn('min-w-0', className)} aria-label="Newsletter signup">
      <NewsletterForm
        formClassName="flex-col gap-2 sm:flex-row sm:items-stretch"
        inputClassName={footerNewsletterFieldClass}
        buttonClassName={footerNewsletterSubmitClass}
        placeholder="Your email"
      />
    </div>
  )
}
