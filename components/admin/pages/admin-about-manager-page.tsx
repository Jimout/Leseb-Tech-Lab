'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { AboutJourneyEditors } from '@/components/admin/pages/about/about-journey-editors'
import { AboutVenturesCtaEditors, AboutVenturesEditors } from '@/components/admin/pages/about/about-ventures-editors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { toggleAccentAtSelection, toggleMainAccentAtSelection } from '@/lib/admin/accent-selection'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/85">{label}</p>
      {children}
    </div>
  )
}

function LinesEditor({
  label,
  lines,
  onChange,
}: {
  label: string
  lines: string[]
  onChange: (next: string[]) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const lastRange = useRef<{ start: number; end: number } | null>(null)
  const [selectedText, setSelectedText] = useState('')
  const text = lines.join('\n')

  function parseLines(nextText: string) {
    return nextText.split('\n')
  }

  function readSelection() {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    if (end <= start) {
      lastRange.current = null
      setSelectedText('')
      return
    }
    lastRange.current = { start, end }
    setSelectedText(el.value.slice(start, end).trim())
  }

  function applyAccent(mode: 'main' | 'second') {
    const r = lastRange.current
    if (!r || r.end <= r.start) return
    const nextText =
      mode === 'main'
        ? toggleMainAccentAtSelection(text, r.start, r.end)
        : toggleAccentAtSelection(text, r.start, r.end)
    onChange(parseLines(nextText))
    lastRange.current = null
    setSelectedText('')
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/85">{label}</p>
      <p className="text-xs text-white/55">
        Select text, then choose a dot: main uses{' '}
        <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">{'{{…}}'}</code> (dark in light mode, yellow in
        dark mode); second uses <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">[[…]]</code> (yellow in
        light mode, accent in dark mode). To remove, select the same words or full marker and click the same dot
        again.
      </p>
      <div className="rounded-xl border border-white/10 bg-white/4 p-3">
        <Textarea
          ref={textareaRef}
          value={text}
          rows={6}
          onChange={(e) => onChange(parseLines(e.target.value))}
          onSelect={readSelection}
          onMouseUp={readSelection}
          onKeyUp={readSelection}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/55">
            Selected: <span className="text-white/75">{selectedText || '—'}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => applyAccent('main')}
              variant="ghost"
              className="h-9 w-9 rounded-full p-0 text-white/80 hover:bg-white/10"
              disabled={!lastRange.current}
              title="Main accent ({{ }})"
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
              onClick={() => applyAccent('second')}
              variant="ghost"
              className="h-9 w-9 rounded-full p-0 text-white/80 hover:bg-white/10"
              disabled={!lastRange.current}
              title="Second accent ([[ ]])"
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
  )
}

export function AdminAboutManagerPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)

  const [metaTitle, setMetaTitle] = useState(settings.about.metaTitle)
  const [metaDescription, setMetaDescription] = useState(settings.about.metaDescription)

  const [heroVisible, setHeroVisible] = useState(settings.aboutHero.visible)
  const [heroEyebrow, setHeroEyebrow] = useState(settings.aboutHero.eyebrow)
  const [heroLines, setHeroLines] = useState<string[]>(settings.aboutHero.lines)
  const [portraitSrc, setPortraitSrc] = useState(settings.aboutHero.portraitSrc)
  const [portraitAlt, setPortraitAlt] = useState(settings.aboutHero.portraitAlt)

  const [journey, setJourney] = useState(settings.aboutJourney)
  const [ventures, setVentures] = useState(settings.aboutVentures)

  const [saveOpen, setSaveOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    setMetaTitle(settings.about.metaTitle)
    setMetaDescription(settings.about.metaDescription)
    setHeroVisible(settings.aboutHero.visible)
    setHeroEyebrow(settings.aboutHero.eyebrow)
    setHeroLines(settings.aboutHero.lines)
    setPortraitSrc(settings.aboutHero.portraitSrc)
    setPortraitAlt(settings.aboutHero.portraitAlt)
    setJourney(settings.aboutJourney)
    setVentures(settings.aboutVentures)
  }, [ready, settings.about, settings.aboutHero, settings.aboutJourney, settings.aboutVentures])

  const changed = useMemo(() => {
    return (
      metaTitle !== settings.about.metaTitle ||
      metaDescription !== settings.about.metaDescription ||
      heroVisible !== settings.aboutHero.visible ||
      heroEyebrow !== settings.aboutHero.eyebrow ||
      portraitSrc !== settings.aboutHero.portraitSrc ||
      portraitAlt !== settings.aboutHero.portraitAlt ||
      JSON.stringify(heroLines) !== JSON.stringify(settings.aboutHero.lines) ||
      JSON.stringify(journey) !== JSON.stringify(settings.aboutJourney) ||
      JSON.stringify(ventures) !== JSON.stringify(settings.aboutVentures)
    )
  }, [
    heroEyebrow,
    heroLines,
    heroVisible,
    journey,
    ventures,
    metaDescription,
    metaTitle,
    portraitAlt,
    portraitSrc,
    settings.about,
    settings.aboutHero,
    settings.aboutJourney,
    settings.aboutVentures,
  ])

  function resetToCurrent() {
    setMetaTitle(settings.about.metaTitle)
    setMetaDescription(settings.about.metaDescription)
    setHeroVisible(settings.aboutHero.visible)
    setHeroEyebrow(settings.aboutHero.eyebrow)
    setHeroLines(settings.aboutHero.lines)
    setPortraitSrc(settings.aboutHero.portraitSrc)
    setPortraitAlt(settings.aboutHero.portraitAlt)
    setJourney(settings.aboutJourney)
    setVentures(settings.aboutVentures)
  }

  function saveNow() {
    patch({
      about: { metaTitle, metaDescription },
      aboutHero: {
        visible: heroVisible,
        eyebrow: heroEyebrow,
        lines: heroLines,
        portraitSrc,
        portraitAlt,
      },
      aboutJourney: journey,
      aboutVentures: ventures,
    })
  }

  return (
    <AdminPageShell
      title="About page"
      description="Manage About page content, images, and section visibility."
      right={
        <div className="flex items-center gap-2">
          <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                disabled={!changed}
                onClick={() => {
                  if (!changed) return
                  setCancelOpen(true)
                }}
              >
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-[#141414] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/65">
                  This will reset the form back to the last saved values.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Keep editing
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-white text-black hover:bg-white/90"
                  onClick={() => {
                    resetToCurrent()
                    setCancelOpen(false)
                  }}
                >
                  Discard
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={saveOpen} onOpenChange={setSaveOpen}>
            <AlertDialogTrigger asChild>
              <Button
                disabled={!changed}
                onClick={() => {
                  if (!changed) return
                  setSaveOpen(true)
                }}
              >
                Save
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-[#141414] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Save changes?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/65">
                  This will save your About page content to the server and update the live public page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => {
                    saveNow()
                    setSaveOpen(false)
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
        <AccordionItem value="metadata" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Metadata
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <div className="grid grid-cols-1 gap-5">
              <Row label="Meta title">
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </Row>
              <Row label="Meta description">
                <Input
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </Row>
            </div>
            <p className="mt-4 text-xs text-white/55">
              Public page: <span className="text-white/75">/about</span>
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="intro" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-white">About intro</p>
                <p className="mt-1 text-sm text-white/65">Controls the “About us” section and portrait.</p>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-white/60">Visible</Label>
                <Switch
                  checked={heroVisible}
                  onCheckedChange={setHeroVisible}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
              <div className="space-y-5">
                <Row label="Eyebrow">
                  <Input
                    value={heroEyebrow}
                    onChange={(e) => setHeroEyebrow(e.target.value)}
                    className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </Row>
                <LinesEditor label="Description lines" lines={heroLines} onChange={setHeroLines} />
                <Row label="Portrait alt text">
                  <Input
                    value={portraitAlt}
                    onChange={(e) => setPortraitAlt(e.target.value)}
                    className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </Row>
              </div>

              <ImageUploadField
                label="Portrait image"
                value={portraitSrc}
                onChange={setPortraitSrc}
                aspectClassName="aspect-3/4"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="journey" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Professional journey
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <AboutJourneyEditors value={journey} onChange={setJourney} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ventures" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-white">Associated ventures</p>
                <p className="mt-1 text-sm text-white/65">Show/hide the ventures + CTA section.</p>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-white/60">Visible</Label>
                <Switch
                  checked={ventures.visible}
                  onCheckedChange={(v) => setVentures((p) => ({ ...p, visible: v }))}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <AboutVenturesEditors value={ventures} onChange={setVentures} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ventures-cta" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Ventures CTA
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <AboutVenturesCtaEditors value={ventures} onChange={setVentures} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}

