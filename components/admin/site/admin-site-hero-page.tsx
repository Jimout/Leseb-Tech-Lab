'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  HeroAsideFields,
  HeroHeadlineFields,
  HeroIntroFields,
} from '@/components/admin/site/hero-site-editors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  buildSiteHeroSettingsForSave,
  type SiteHeroSettings,
} from '@/lib/admin/site-settings'

export function AdminSiteHeroPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)
  const [hero, setHero] = useState<SiteHeroSettings>(settings.hero)

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    setHero(settings.hero)
  }, [ready, settings.hero])

  const savedHero = useMemo(() => buildSiteHeroSettingsForSave(settings.hero), [settings.hero])

  const changed = useMemo(
    () => JSON.stringify(buildSiteHeroSettingsForSave(hero)) !== JSON.stringify(savedHero),
    [hero, savedHero],
  )

  function resetToSaved() {
    setHero(settings.hero)
  }

  function saveNow() {
    patch({ hero: buildSiteHeroSettingsForSave(hero) })
  }

  function patchHero(patchSlice: Partial<SiteHeroSettings>) {
    setHero((prev) => ({ ...prev, ...patchSlice }))
  }

  return (
    <AdminPageShell
      title="Homepage hero"
      description="Sections match the landing hero top to bottom."
      right={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-white/15 bg-transparent text-white hover:bg-white/10">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              View homepage
              <ExternalLink className="ml-2 size-3.5 opacity-70" aria-hidden />
            </Link>
          </Button>

          <AdminPageSaveCancelActions
            changed={changed}
            pageName="Homepage hero"
            publicPath="/"
            onSave={saveNow}
            onDiscard={resetToSaved}
          />
        </div>
      }
    >
      <Accordion type="multiple" defaultValue={['headline']} className="space-y-3">
        <AccordionItem value="headline" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Headline</p>
              <p className="mt-1 text-sm font-normal text-white/60">Eyebrow and main title at the top</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <HeroHeadlineFields value={hero} onChange={patchHero} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="intro" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Intro</p>
              <p className="mt-1 text-sm font-normal text-white/60">Left column — “What is Leseb?” and CTA</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <HeroIntroFields value={hero} onChange={patchHero} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="aside" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Aside</p>
              <p className="mt-1 text-sm font-normal text-white/60">Right column meta on desktop</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <HeroAsideFields value={hero} onChange={patchHero} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}
