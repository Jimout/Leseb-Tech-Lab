'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { AdminField } from '@/components/admin/pages/about/about-editorial-editors'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  buildInsightTocSettingsForSave,
  type SiteInsightTocSettings,
} from '@/lib/admin/site-settings'

const fieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/40'

export function AdminSiteInsightTocPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)
  const [toc, setToc] = useState<SiteInsightTocSettings>(settings.insightToc)

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    setToc(settings.insightToc)
  }, [ready, settings.insightToc])

  const savedToc = useMemo(() => buildInsightTocSettingsForSave(settings.insightToc), [settings.insightToc])

  const changed = useMemo(
    () => JSON.stringify(buildInsightTocSettingsForSave(toc)) !== JSON.stringify(savedToc),
    [toc, savedToc],
  )

  function resetToSaved() {
    setToc(settings.insightToc)
  }

  function saveNow() {
    patch({ insightToc: buildInsightTocSettingsForSave(toc) })
  }

  function patchToc(patchSlice: Partial<SiteInsightTocSettings>) {
    setToc((prev) => ({ ...prev, ...patchSlice }))
  }

  return (
    <AdminPageShell
      title="Insight TOC logo"
      description="Logo beside “Contents” on structured insight articles."
      right={
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-white/15 bg-transparent text-white hover:bg-white/10">
            <Link href="/insights" target="_blank" rel="noopener noreferrer">
              View insights
              <ExternalLink className="ml-2 size-3.5 opacity-70" aria-hidden />
            </Link>
          </Button>

          <AdminPageSaveCancelActions
            changed={changed}
            pageName="Insight TOC logo"
            publicPath="/insights"
            onSave={saveNow}
            onDiscard={resetToSaved}
          />
        </div>
      }
    >
      <Accordion type="multiple" defaultValue={['logo']} className="space-y-3">
        <AccordionItem value="logo" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="text-left">
              <p className="text-sm font-semibold">Logo</p>
              <p className="mt-1 text-sm font-normal text-white/60">Shown in the table of contents sidebar on article pages</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-5 pb-6 sm:px-6">
            <ImageUploadField
              label="Logo image"
              value={toc.markSrc}
              onChange={(markSrc) => patchToc({ markSrc })}
              aspectClassName="aspect-square"
            />
            <AdminField label="Alt text" hint="For screen readers.">
              <Input
                value={toc.markAlt}
                onChange={(e) => patchToc({ markAlt: e.target.value })}
                placeholder="Leseb Tech Lab"
                className={fieldClass}
              />
            </AdminField>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}
