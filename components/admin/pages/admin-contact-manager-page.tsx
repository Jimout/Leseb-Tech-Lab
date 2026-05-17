'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  AdminField,
  ContactEnquiriesFields,
  ContactFormFields,
  ContactHeroFields,
  ContactSocialFields,
  contactFieldClass,
} from '@/components/admin/pages/contact/contact-page-editors'
import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  buildContactSettingsForSave,
  type ContactPageSettings,
} from '@/lib/admin/site-settings'

export function AdminContactManagerPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)

  const [metaTitle, setMetaTitle] = useState(settings.contact.metaTitle)
  const [metaDescription, setMetaDescription] = useState(settings.contact.metaDescription)
  const [contact, setContact] = useState<ContactPageSettings>(settings.contact)

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    setMetaTitle(settings.contact.metaTitle)
    setMetaDescription(settings.contact.metaDescription)
    setContact(settings.contact)
  }, [ready, settings.contact])

  const savedContact = useMemo(
    () => buildContactSettingsForSave(settings.contact, settings.footer.phone),
    [settings.contact, settings.footer.phone],
  )

  const changed = useMemo(() => {
    const nextContact = buildContactSettingsForSave(contact, contact.phone)
    return (
      metaTitle !== settings.contact.metaTitle ||
      metaDescription !== settings.contact.metaDescription ||
      JSON.stringify(nextContact) !== JSON.stringify(savedContact) ||
      (contact.phone.trim() && contact.phone !== settings.footer.phone)
    )
  }, [contact, metaDescription, metaTitle, savedContact, settings.contact, settings.footer.phone])

  function resetToSaved() {
    setMetaTitle(settings.contact.metaTitle)
    setMetaDescription(settings.contact.metaDescription)
    setContact(settings.contact)
  }

  function saveNow() {
    const nextContact = buildContactSettingsForSave(
      { ...contact, metaTitle, metaDescription },
      settings.footer.phone,
    )
    patch({
      contact: nextContact,
      footer: { ...settings.footer, phone: nextContact.phone },
    })
  }

  function patchContact(patchSlice: Partial<ContactPageSettings>) {
    setContact((prev) => ({ ...prev, ...patchSlice }))
  }

  return (
    <AdminPageShell
      title="Contact page"
      description="Sections match /contact top to bottom. Open one panel at a time."
      right={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-white/15 bg-transparent text-white hover:bg-white/10">
            <Link href="/contact" target="_blank" rel="noopener noreferrer">
              View page
              <ExternalLink className="ml-2 size-3.5 opacity-70" aria-hidden />
            </Link>
          </Button>

          <AdminPageSaveCancelActions
            changed={changed}
            pageName="Contact"
            publicPath="/contact"
            onSave={saveNow}
            onDiscard={resetToSaved}
          />
        </div>
      }
    >
      <Accordion type="multiple" defaultValue={['hero']} className="space-y-3">
        <AccordionItem value="seo" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">SEO</p>
              <p className="mt-1 text-sm font-normal text-white/60">Search title and description</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-5 pb-6 sm:px-6">
            <AdminField label="Meta title">
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={contactFieldClass} />
            </AdminField>
            <AdminField label="Meta description">
              <Input
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className={contactFieldClass}
              />
            </AdminField>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hero" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Hero</p>
              <p className="mt-1 text-sm font-normal text-white/60">Large headline at the top of the page</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <ContactHeroFields value={contact} onChange={patchContact} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="enquiries" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Enquiries</p>
              <p className="mt-1 text-sm font-normal text-white/60">Left column — intro, email, and phone</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <ContactEnquiriesFields value={contact} onChange={patchContact} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="form" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Form</p>
              <p className="mt-1 text-sm font-normal text-white/60">Contact form on the right</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <ContactFormFields value={contact} onChange={patchContact} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Social</p>
              <p className="mt-1 text-sm font-normal text-white/60">Elsewhere links below the intro</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <ContactSocialFields value={contact} onChange={patchContact} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}
