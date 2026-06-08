'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  AdminField,
  LetterEditor,
  ParagraphListEditor,
  PrinciplesEditor,
} from '@/components/admin/pages/about/about-editorial-editors'
import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { AboutEditorialContentSettings } from '@/lib/admin/site-settings'

const fieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/40'

// Default values
const DEFAULT_ABOUT = {
  metaTitle: 'About Us',
  metaDescription: 'Learn more about our team and mission',
  aboutEditorial: {
    heroEyebrow: 'About Us',
    heroLine1: 'We are',
    heroAccent: 'building the future',
    letterSidebar: 'Our story',
    letterOpening: 'We started with a simple idea',
    letterBody: '<p>We believe in creating exceptional digital experiences.</p>',
    letterSignoff: 'The Team',
    principlesHeading: 'Our Principles',
    principlesSubheading: 'What guides our work',
    principles: [],
    foundersEyebrow: 'The Team',
    foundersTitle: 'Meet the founders',
    foundersParagraphs: ['We are passionate about what we do.'],
    ctaEyebrow: 'Get in touch',
    ctaHeadingBefore: 'Ready to',
    ctaHeadingAccent: 'work together?',
    ctaButtonLabel: 'Contact Us',
    ctaHref: '/contact',
  }
}

export function AdminAboutManagerPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)

  // Safely extract settings with defaults
  const aboutSettings = useMemo(() => {
    const about = (settings as any)?.about || {}
    const aboutEditorial = (settings as any)?.aboutEditorial || DEFAULT_ABOUT.aboutEditorial
    
    return {
      metaTitle: about.metaTitle || DEFAULT_ABOUT.metaTitle,
      metaDescription: about.metaDescription || DEFAULT_ABOUT.metaDescription,
      aboutEditorial: aboutEditorial,
    }
  }, [settings])

  const [metaTitle, setMetaTitle] = useState(aboutSettings.metaTitle)
  const [metaDescription, setMetaDescription] = useState(aboutSettings.metaDescription)
  const [editorial, setEditorial] = useState<AboutEditorialContentSettings>(aboutSettings.aboutEditorial)

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    setMetaTitle(aboutSettings.metaTitle)
    setMetaDescription(aboutSettings.metaDescription)
    setEditorial(aboutSettings.aboutEditorial)
  }, [ready, aboutSettings])

  const changed = useMemo(() => {
    return (
      metaTitle !== aboutSettings.metaTitle ||
      metaDescription !== aboutSettings.metaDescription ||
      JSON.stringify(editorial) !== JSON.stringify(aboutSettings.aboutEditorial)
    )
  }, [editorial, metaDescription, metaTitle, aboutSettings])

  function resetToSaved() {
    setMetaTitle(aboutSettings.metaTitle)
    setMetaDescription(aboutSettings.metaDescription)
    setEditorial(aboutSettings.aboutEditorial)
  }

  function saveNow() {
    patch({
      about: { metaTitle, metaDescription },
      aboutEditorial: editorial,
    })
  }

  function patchEditorial(patchSlice: Partial<AboutEditorialContentSettings>) {
    setEditorial((prev) => ({ ...prev, ...patchSlice }))
  }

  if (!ready) {
    return (
      <AdminPageShell title="About page" description="Edit the live /about page.">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-white/60">
          Loading about page content...
        </div>
      </AdminPageShell>
    )
  }

  return (
    <AdminPageShell
      title="About page"
      description="Edit the live /about page. Sections match the public layout top to bottom."
      right={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-white/15 bg-transparent text-white hover:bg-white/10">
            <Link href="/about" target="_blank" rel="noopener noreferrer">
              View page
              <ExternalLink className="ml-2 size-3.5 opacity-70" aria-hidden />
            </Link>
          </Button>

          <AdminPageSaveCancelActions
            changed={changed}
            pageName="About"
            publicPath="/about"
            onSave={saveNow}
            onDiscard={resetToSaved}
          />
        </div>
      }
    >
      <Accordion type="multiple" defaultValue={['seo', 'hero']} className="space-y-3">
        <AccordionItem value="seo" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">SEO</p>
              <p className="mt-1 text-sm font-normal text-white/60">Browser tab title and search snippet</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-5 pb-6 sm:px-6">
            <AdminField label="Meta title">
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={fieldClass} />
            </AdminField>
            <AdminField label="Meta description">
              <Input
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className={fieldClass}
              />
            </AdminField>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hero" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Hero</p>
              <p className="mt-1 text-sm font-normal text-white/60">Eyebrow and main headline</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-5 pb-6 sm:px-6">
            <AdminField label="Eyebrow">
              <Input
                value={editorial.heroEyebrow || ''}
                onChange={(e) => patchEditorial({ heroEyebrow: e.target.value })}
                className={fieldClass}
              />
            </AdminField>
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Headline line 1">
                <Input
                  value={editorial.heroLine1 || ''}
                  onChange={(e) => patchEditorial({ heroLine1: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
              <AdminField label="Accent line (italic)">
                <Input
                  value={editorial.heroAccent || ''}
                  onChange={(e) => patchEditorial({ heroAccent: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="letter" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Letter</p>
              <p className="mt-1 text-sm font-normal text-white/60">Sidebar, opening line, body, and sign-off</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <LetterEditor value={editorial} onChange={patchEditorial} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="principles" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Principles</p>
              <p className="mt-1 text-sm font-normal text-white/60">Numbered list with optional visibility per item</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-5 pb-6 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Section heading">
                <Input
                  value={editorial.principlesHeading || ''}
                  onChange={(e) => patchEditorial({ principlesHeading: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
              <AdminField label="Section subheading">
                <Input
                  value={editorial.principlesSubheading || ''}
                  onChange={(e) => patchEditorial({ principlesSubheading: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
            </div>
            <PrinciplesEditor
              principles={editorial.principles || []}
              onChange={(principles) => patchEditorial({ principles })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="founders" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Founders</p>
              <p className="mt-1 text-sm font-normal text-white/60">Team section after principles</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-5 pb-6 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Eyebrow">
                <Input
                  value={editorial.foundersEyebrow || ''}
                  onChange={(e) => patchEditorial({ foundersEyebrow: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
              <AdminField label="Title">
                <Input
                  value={editorial.foundersTitle || ''}
                  onChange={(e) => patchEditorial({ foundersTitle: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
            </div>
            <ParagraphListEditor
              label="Paragraphs"
              values={editorial.foundersParagraphs || []}
              onChange={(foundersParagraphs) => patchEditorial({ foundersParagraphs })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cta" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Closing CTA</p>
              <p className="mt-1 text-sm font-normal text-white/60">Bottom section before the footer</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-5 pb-6 sm:px-6">
            <AdminField label="Eyebrow">
              <Input
                value={editorial.ctaEyebrow || ''}
                onChange={(e) => patchEditorial({ ctaEyebrow: e.target.value })}
                className={fieldClass}
              />
            </AdminField>
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Heading (before accent)">
                <Input
                  value={editorial.ctaHeadingBefore || ''}
                  onChange={(e) => patchEditorial({ ctaHeadingBefore: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
              <AdminField label="Heading accent (italic)">
                <Input
                  value={editorial.ctaHeadingAccent || ''}
                  onChange={(e) => patchEditorial({ ctaHeadingAccent: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Button label">
                <Input
                  value={editorial.ctaButtonLabel || ''}
                  onChange={(e) => patchEditorial({ ctaButtonLabel: e.target.value })}
                  className={fieldClass}
                />
              </AdminField>
              <AdminField label="Button link">
                <Input
                  value={editorial.ctaHref || ''}
                  onChange={(e) => patchEditorial({ ctaHref: e.target.value })}
                  className={fieldClass}
                  placeholder="/"
                />
              </AdminField>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}