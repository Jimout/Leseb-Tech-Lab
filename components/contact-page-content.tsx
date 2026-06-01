'use client'

import { ContactPageBody } from '@/components/contact-page-body'
import { ContactPageHero } from '@/components/contact-page-hero'
import { useSiteSettings } from '@/hooks/use-site-settings'

export function ContactPageContent() {
  const { settings } = useSiteSettings()

  return (
    <>
      <ContactPageHero contact={settings.contact} />
      <ContactPageBody />
    </>
  )
}
