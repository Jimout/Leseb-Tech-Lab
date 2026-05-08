'use client'

import { useRef, useState, useId } from 'react'

import { ImageUploadField } from '@/components/admin/image-upload-field'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import type { AboutAssociatedVenturesSettings, AboutVenturesLogo } from '@/lib/admin/site-settings'
import { toggleAccentAtSelection, toggleMainAccentAtSelection } from '@/lib/admin/accent-selection'

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

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
          rows={5}
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

function LogoCard({
  logo,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  logo: AboutVenturesLogo
  index: number
  total: number
  onChange: (next: AboutVenturesLogo) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const switchId = useId()
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A1A1B] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor={switchId} className="text-xs text-white/60">
            Visible
          </Label>
          <Switch id={switchId} checked={logo.visible} onCheckedChange={(v) => onChange({ ...logo, visible: v })} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move up"
          >
            <ArrowUp className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label="Move down"
          >
            <ArrowDown className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onDelete}
            aria-label="Delete logo"
            title="Delete logo"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Row label="Company name (alt text)">
          <Input
            value={logo.alt}
            onChange={(e) => onChange({ ...logo, alt: e.target.value })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            placeholder="NEDF Studios"
          />
        </Row>
        <Row label="Website link (optional)">
          <Input
            value={logo.href ?? ''}
            onChange={(e) => onChange({ ...logo, href: e.target.value })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            placeholder="https://example.com"
          />
        </Row>
        <Row label="Logo image (upload)">
          <ImageUploadField
            label="Logo image"
            value={logo.src}
            onChange={(src) => onChange({ ...logo, src })}
            aspectClassName="aspect-[3/1]"
          />
        </Row>
      </div>
    </div>
  )
}

export function AboutVenturesEditors({
  value,
  onChange,
}: {
  value: AboutAssociatedVenturesSettings
  onChange: (next: AboutAssociatedVenturesSettings) => void
}) {
  return (
    <Accordion type="multiple" defaultValue={[]} className="space-y-3">
      <AccordionItem value="ventures-headline" className="rounded-2xl border border-white/10 bg-white/5 px-0">
        <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
          Headline lines
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 sm:px-6">
          <div className="grid grid-cols-1 gap-5">
            <LinesEditor
              label="Headline lines"
              lines={value.headlineLines}
              onChange={(headlineLines) => onChange({ ...value, headlineLines })}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="ventures-logos" className="rounded-2xl border border-white/10 bg-white/5 px-0">
        <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
          Logos
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-sm font-semibold text-white">Logos</p>
            <p className="mt-1 text-sm text-white/65">Manage NEDF Studios, Roha Digitals, Leseb Tech Lab.</p>

            <div className="mt-5 space-y-4">
              {value.logos.map((logo, idx) => (
                <LogoCard
                  key={logo.id}
                  logo={logo}
                  index={idx}
                  total={value.logos.length}
                  onChange={(nextLogo) =>
                    onChange({
                      ...value,
                      logos: value.logos.map((x) => (x.id === logo.id ? nextLogo : x)),
                    })
                  }
                  onDelete={() => onChange({ ...value, logos: value.logos.filter((x) => x.id !== logo.id) })}
                  onMoveUp={() => {
                    if (idx === 0) return
                    const copy = [...value.logos]
                    const a = copy[idx - 1]
                    copy[idx - 1] = copy[idx]
                    copy[idx] = a
                    onChange({ ...value, logos: copy })
                  }}
                  onMoveDown={() => {
                    if (idx === value.logos.length - 1) return
                    const copy = [...value.logos]
                    const a = copy[idx + 1]
                    copy[idx + 1] = copy[idx]
                    copy[idx] = a
                    onChange({ ...value, logos: copy })
                  }}
                />
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  onChange({
                    ...value,
                    logos: [
                      ...value.logos,
                      { id: uid('venture-logo'), visible: true, src: '', alt: '', href: '' },
                    ],
                  })
                }
              >
                Add logo
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function AboutVenturesCtaEditors({
  value,
  onChange,
}: {
  value: AboutAssociatedVenturesSettings
  onChange: (next: AboutAssociatedVenturesSettings) => void
}) {
  const switchId = useId()
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">CTA</p>
        <div className="flex items-center gap-2">
          <Label htmlFor={switchId} className="text-xs text-white/60">
            Visible
          </Label>
          <Switch
            id={switchId}
            checked={value.ctaVisible}
            onCheckedChange={(ctaVisible) => onChange({ ...value, ctaVisible })}
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5">
        <LinesEditor
          label="CTA heading lines"
          lines={value.ctaHeadingLines}
          onChange={(ctaHeadingLines) => onChange({ ...value, ctaHeadingLines })}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Row label="Button label">
            <Input
              value={value.ctaButtonLabel}
              onChange={(e) => onChange({ ...value, ctaButtonLabel: e.target.value })}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            />
          </Row>
          <Row label="Button link">
            <Input
              value={value.ctaHref}
              onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
              placeholder="/contact"
            />
          </Row>
        </div>
        <Row label="Signature name">
          <Input
            value={value.signatureName}
            onChange={(e) => onChange({ ...value, signatureName: e.target.value })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </Row>
      </div>
    </div>
  )
}

