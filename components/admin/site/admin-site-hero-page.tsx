'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { SimpleForm, type Field } from '@/components/admin/simple-form'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { toggleAccentAtSelection, toggleMainAccentAtSelection } from '@/lib/admin/accent-selection'
import type { SiteHeroSettings } from '@/lib/admin/site-settings'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

function useHeroFields(): readonly Field[] {
  return useMemo(
    () => [
      { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
      { key: 'nameLine1', label: 'Name line 1', kind: 'text' },
      { key: 'nameLine2', label: 'Name line 2', kind: 'text' },
      { key: 'tagline', label: 'Tagline', kind: 'text' },
      { key: 'roleLine1', label: 'Role line 1', kind: 'text' },
      { key: 'roleLine2', label: 'Role line 2', kind: 'text' },
      { key: 'whoAmIEyebrow', label: 'About intro eyebrow', kind: 'text' },
      { key: 'whoAmIButtonLabel', label: 'About intro button label', kind: 'text' },
      { key: 'whoAmIButtonHref', label: 'About intro button link', kind: 'text' },
    ],
    [],
  )
}

export function AdminSiteHeroPage() {
  const { settings, patch } = useSiteSettings()
  const heroFields = useHeroFields()
  const [draft, setDraft] = useState<SiteHeroSettings>(settings.hero)
  const [selected, setSelected] = useState('')
  const bodyRef = useRef<HTMLTextAreaElement | null>(null)
  /** Button click clears textarea selection — keep last range from select/mouseup/keyup */
  const lastBodyRange = useRef<{ start: number; end: number } | null>(null)

  useEffect(() => {
    setDraft(settings.hero)
  }, [settings.hero])

  const changed = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings.hero), [draft, settings.hero])

  return (
    <AdminPageShell
      title="Hero"
      description="Edit the main landing hero text."
      right={
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" disabled={!changed}>
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                <AlertDialogDescription>This will revert all hero edits back to the last saved values.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction onClick={() => setDraft(settings.hero)}>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!changed}>Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save hero changes?</AlertDialogTitle>
                <AlertDialogDescription>This will update the hero content used on the homepage.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    patch({ hero: draft as any })
                  }}
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
    >
      <Accordion type="multiple" defaultValue={[]} className="space-y-3">
        <AccordionItem value="hero-content" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Hero content
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <SimpleForm
              title=""
              fields={heroFields}
              initial={draft as any}
              onSubmit={(values) => setDraft(values as any)}
              onChange={(values) => setDraft(values as any)}
              submitLabel={undefined}
            />

            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-white/85">About intro body (accent)</p>
              <p className="text-xs text-white/55">
                Select text, then choose a dot: main accent uses{' '}
                <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">{'{{…}}'}</code> (theme{' '}
                <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">--accent</code>: dark in light mode,
                yellow in dark mode). Second accent uses{' '}
                <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">[[…]]</code> (yellow in light mode,
                accent in dark mode). To remove, select the same words or the full marker block and click the same dot
                again.
              </p>
              <div className="rounded-xl border border-white/10 bg-white/4 p-3">
                <Textarea
                  ref={bodyRef}
                  value={draft.whoAmIBody}
                  rows={6}
                  onChange={(e) => setDraft((p) => ({ ...p, whoAmIBody: e.target.value }))}
                  onSelect={() => {
                    const el = bodyRef.current
                    if (!el) return
                    const start = el.selectionStart ?? 0
                    const end = el.selectionEnd ?? 0
                    if (end <= start) {
                      lastBodyRange.current = null
                      setSelected('')
                      return
                    }
                    lastBodyRange.current = { start, end }
                    setSelected(el.value.slice(start, end).trim())
                  }}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-white/55">
                    Selected: <span className="text-white/75">{selected || '—'}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const r = lastBodyRange.current
                        if (!r || r.end <= r.start) return
                        setDraft((p) => ({
                          ...p,
                          whoAmIBody: toggleMainAccentAtSelection(p.whoAmIBody, r.start, r.end),
                        }))
                        lastBodyRange.current = null
                        setSelected('')
                      }}
                      variant="ghost"
                      className="h-9 w-9 rounded-full p-0 text-white/80 hover:bg-white/10"
                      disabled={!lastBodyRange.current}
                      title="Main accent ({{ }}) — --accent"
                      aria-label="Toggle main accent on selected text"
                    >
                      <span
                        className="block size-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: 'var(--accent)' }}
                        aria-hidden
                      />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const r = lastBodyRange.current
                        if (!r || r.end <= r.start) return
                        setDraft((p) => ({
                          ...p,
                          whoAmIBody: toggleAccentAtSelection(p.whoAmIBody, r.start, r.end),
                        }))
                        lastBodyRange.current = null
                        setSelected('')
                      }}
                      variant="ghost"
                      className="h-9 w-9 rounded-full p-0 text-white/80 hover:bg-white/10"
                      disabled={!lastBodyRange.current}
                      title="Second accent ([[ ]]) — kicker ink"
                      aria-label="Toggle second accent on selected text"
                    >
                      <span
                        className="block size-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: 'var(--secondary)' }}
                        aria-hidden
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="backdrop-images" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Hero backdrop images
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <p className="text-sm text-white/65">Light and dark mode logo images shown behind the hero.</p>
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ImageUploadField
                label="Light backdrop"
                value={draft.backdropLightSrc}
                onChange={(next) => setDraft((p) => ({ ...p, backdropLightSrc: next }))}
                aspectClassName="aspect-16/9"
              />
              <ImageUploadField
                label="Dark backdrop"
                value={draft.backdropDarkSrc}
                onChange={(next) => setDraft((p) => ({ ...p, backdropDarkSrc: next }))}
                aspectClassName="aspect-16/9"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}

