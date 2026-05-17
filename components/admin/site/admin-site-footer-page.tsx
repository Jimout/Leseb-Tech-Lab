'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  FooterAboutPanelFields,
  FooterContactFields,
  FooterNewsletterBannerFields,
  FooterSocialFields,
  FooterWorkPanelFields,
} from '@/components/admin/site/footer-site-editors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  buildSiteFooterSettingsForSave,
  type SiteFooterSettings,
} from '@/lib/admin/site-settings'

export function AdminSiteFooterPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)
  const [footer, setFooter] = useState<SiteFooterSettings>(settings.footer)

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    setFooter(settings.footer)
  }, [ready, settings.footer])

  const savedFooter = useMemo(() => buildSiteFooterSettingsForSave(settings.footer), [settings.footer])

  const changed = useMemo(
    () => JSON.stringify(buildSiteFooterSettingsForSave(footer)) !== JSON.stringify(savedFooter),
    [footer, savedFooter],
  )

  function resetToSaved() {
    setFooter(settings.footer)
  }

  function saveNow() {
    const nextFooter = buildSiteFooterSettingsForSave(footer)
    patch({
      footer: nextFooter,
      contact: { ...settings.contact, phone: settings.contact.phone.trim() ? settings.contact.phone : nextFooter.phone },
    })
  }

  function patchFooter(patchSlice: Partial<SiteFooterSettings>) {
    setFooter((prev) => ({ ...prev, ...patchSlice }))
  }

  return (
    <AdminPageShell
      title="Footer"
      description="Sections match the site footer top to bottom."
      right={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-white/15 bg-transparent text-white hover:bg-white/10">
            <Link href="/#contact" target="_blank" rel="noopener noreferrer">
              View footer
              <ExternalLink className="ml-2 size-3.5 opacity-70" aria-hidden />
            </Link>
          </Button>

          <AdminPageSaveCancelActions
            changed={changed}
            pageName="Footer"
            publicPath="/#contact"
            onSave={saveNow}
            onDiscard={resetToSaved}
          />
        </div>
      }
    >
      <Accordion type="multiple" defaultValue={['work-panel']} className="space-y-3">
        <AccordionItem value="work-panel" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Work together panel</p>
              <p className="mt-1 text-sm font-normal text-white/60">Left panel — links to Contact</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <FooterWorkPanelFields value={footer} onChange={patchFooter} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about-panel" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">About panel</p>
              <p className="mt-1 text-sm font-normal text-white/60">Right panel — links to About</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <FooterAboutPanelFields value={footer} onChange={patchFooter} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Contact</p>
              <p className="mt-1 text-sm font-normal text-white/60">Email, phone, and privacy link</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <FooterContactFields value={footer} onChange={patchFooter} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Social</p>
              <p className="mt-1 text-sm font-normal text-white/60">Elsewhere icons in the footer</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <FooterSocialFields value={footer} onChange={patchFooter} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="newsletter-banner" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Newsletter banner</p>
              <p className="mt-1 text-sm font-normal text-white/60">Homepage newsletter block (separate from footer)</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <FooterNewsletterBannerFields value={footer} onChange={patchFooter} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}
