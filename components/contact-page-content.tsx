import { ContactPageBody } from '@/components/contact-page-body'
import { ContactPageHero } from '@/components/contact-page-hero'
import { getSiteSettingsFromDb } from '@/lib/site-settings-db'

export async function ContactPageContent() {
  const settings = await getSiteSettingsFromDb()

  return (
    <>
      <ContactPageHero contact={settings.contact} />
      <ContactPageBody />
    </>
  )
}
