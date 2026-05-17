'use client'

import { createId } from '@paralleldrive/cuid2'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toggleAccentAtSelection, toggleMainAccentAtSelection } from '@/lib/admin/accent-selection'
import type { AboutEditorialContentSettings, AboutEditorialPrinciple } from '@/lib/admin/site-settings'

const fieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/40'

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/85">{label}</p>
      {hint ? <p className="text-xs text-white/55">{hint}</p> : null}
      {children}
    </div>
  )
}

export function ParagraphListEditor({
  label,
  hint,
  values,
  onChange,
  rows = 4,
}: {
  label: string
  hint?: string
  values: string[]
  onChange: (next: string[]) => void
  rows?: number
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-white/85">{label}</p>
        {hint ? <p className="text-xs text-white/55">{hint}</p> : null}
      </div>
      {values.map((value, index) => (
        <div key={`paragraph-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Paragraph {index + 1}</p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-white/70 hover:bg-white/10 hover:text-white"
              disabled={values.length <= 1}
              onClick={() => onChange(values.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-3.5" aria-hidden />
              <span className="sr-only">Remove paragraph</span>
            </Button>
          </div>
          <Textarea
            value={value}
            rows={rows}
            onChange={(e) => {
              const next = [...values]
              next[index] = e.target.value
              onChange(next)
            }}
            className={fieldClass}
          />
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="border-white/15 bg-white/5 text-white hover:bg-white/10"
        onClick={() => onChange([...values, ''])}
      >
        <Plus className="mr-1.5 size-3.5" aria-hidden />
        Add paragraph
      </Button>
    </div>
  )
}

export function PrinciplesEditor({
  principles,
  onChange,
}: {
  principles: AboutEditorialPrinciple[]
  onChange: (next: AboutEditorialPrinciple[]) => void
}) {
  function updateAt(index: number, patch: Partial<AboutEditorialPrinciple>) {
    onChange(principles.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= principles.length) return
    const next = [...principles]
    const [row] = next.splice(index, 1)
    next.splice(target, 0, row!)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {principles.map((principle, index) => (
        <div key={principle.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white/90">Principle {index + 1}</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/60">Visible</p>
                <Switch
                  checked={principle.visible}
                  onCheckedChange={(visible) => updateAt(index, { visible })}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-white/70 hover:bg-white/10"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label="Move up"
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-white/70 hover:bg-white/10"
                disabled={index === principles.length - 1}
                onClick={() => move(index, 1)}
                aria-label="Move down"
              >
                <ChevronDown className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-white/70 hover:bg-white/10"
                disabled={principles.length <= 1}
                onClick={() => onChange(principles.filter((_, i) => i !== index))}
                aria-label="Remove principle"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <AdminField label="Numeral">
              <Input
                value={principle.numeral}
                onChange={(e) => updateAt(index, { numeral: e.target.value })}
                className={`${fieldClass} max-w-[5rem]`}
              />
            </AdminField>
            <AdminField label="Title">
              <Input
                value={principle.title}
                onChange={(e) => updateAt(index, { title: e.target.value })}
                className={fieldClass}
              />
            </AdminField>
            <AdminField label="Body">
              <Textarea
                value={principle.body}
                rows={3}
                onChange={(e) => updateAt(index, { body: e.target.value })}
                className={fieldClass}
              />
            </AdminField>
          </div>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="border-white/15 bg-white/5 text-white hover:bg-white/10"
        onClick={() =>
          onChange([
            ...principles,
            {
              id: createId(),
              visible: true,
              numeral: `${principles.length + 1}.`,
              title: 'New principle',
              body: '',
            },
          ])
        }
      >
        <Plus className="mr-1.5 size-3.5" aria-hidden />
        Add principle
      </Button>
    </div>
  )
}

export type AboutEditorialFormState = AboutEditorialContentSettings

function LetterFieldBlock({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <header className="border-b border-white/10 pb-3">
        <p className="text-sm font-semibold text-white/90">{title}</p>
        {description ? <p className="mt-1 text-xs leading-relaxed text-white/55">{description}</p> : null}
      </header>
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  )
}

export function AccentTextareaField({
  label,
  hint,
  value,
  rows,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  rows: number
  onChange: (next: string) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const lastRange = useRef<{ start: number; end: number } | null>(null)
  const [selectedText, setSelectedText] = useState('')

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
    const next =
      mode === 'main'
        ? toggleMainAccentAtSelection(value, r.start, r.end)
        : toggleAccentAtSelection(value, r.start, r.end)
    onChange(next)
    lastRange.current = null
    setSelectedText('')
  }

  return (
    <AdminField label={label} hint={hint}>
      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <Textarea
          ref={textareaRef}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          onSelect={readSelection}
          onMouseUp={readSelection}
          onKeyUp={readSelection}
          className={`${fieldClass} resize-y`}
        />
        <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-white/55">
            Select text, then pick a dot. Lemon{' '}
            <code className="rounded bg-white/10 px-1 text-[10px]">[[like this]]</code> · Green{' '}
            <code className="rounded bg-white/10 px-1 text-[10px]">{'{{like this}}'}</code>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/50">
              Selected: <span className="text-white/75">{selectedText || '—'}</span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 w-9 rounded-full p-0 text-white/80 hover:bg-white/10"
              disabled={!lastRange.current}
              title="Lemon accent [[ ]]"
              aria-label="Toggle lemon accent on selected text"
              onClick={() => applyAccent('second')}
            >
              <span
                className="block size-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: 'var(--secondary)' }}
                aria-hidden
              />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 w-9 rounded-full p-0 text-white/80 hover:bg-white/10"
              disabled={!lastRange.current}
              title="Green accent {{ }}"
              aria-label="Toggle green accent on selected text"
              onClick={() => applyAccent('main')}
            >
              <span
                className="block size-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: 'var(--primary)' }}
                aria-hidden
              />
            </Button>
          </div>
        </div>
      </div>
    </AdminField>
  )
}

export function LetterEditor({
  value,
  onChange,
}: {
  value: Pick<
    AboutEditorialContentSettings,
    'letterSidebarLabel' | 'letterSidebarMeta' | 'letterOpening' | 'letterBody' | 'letterSignOff'
  >
  onChange: (patch: Partial<AboutEditorialContentSettings>) => void
}) {
  return (
    <div className="space-y-6">
      <LetterFieldBlock
        title="Sidebar"
        description="Small label beside the letter on desktop. Separate from the main copy."
      >
        <AdminField label="Title">
          <Input
            value={value.letterSidebarLabel}
            onChange={(e) => onChange({ letterSidebarLabel: e.target.value })}
            className={fieldClass}
            placeholder="A letter"
          />
        </AdminField>
        <AdminField label="Note" hint="One line, or press Enter for a second line.">
          <Textarea
            value={value.letterSidebarMeta}
            rows={2}
            onChange={(e) => onChange({ letterSidebarMeta: e.target.value })}
            className={fieldClass}
            placeholder={'From the founders\nAddis Ababa, 2026'}
          />
        </AdminField>
      </LetterFieldBlock>

      <LetterFieldBlock title="Opening line" description="Large first sentence only.">
        <AccentTextareaField
          label="Text"
          hint="Shown as the big intro on /about."
          value={value.letterOpening}
          rows={4}
          onChange={(letterOpening) => onChange({ letterOpening })}
        />
      </LetterFieldBlock>

      <LetterFieldBlock
        title="Body"
        description="Put a blank line between each paragraph so they stay separate on the site."
      >
        <AccentTextareaField
          label="Paragraphs"
          value={value.letterBody}
          rows={12}
          onChange={(letterBody) => onChange({ letterBody })}
        />
      </LetterFieldBlock>

      <LetterFieldBlock title="Sign-off" description="Closing line under the letter. Plain text only.">
        <AdminField label="Line">
          <Input
            value={value.letterSignOff}
            onChange={(e) => onChange({ letterSignOff: e.target.value })}
            className={fieldClass}
            placeholder="The Leseb Founders · ለሰብ · For humans"
          />
        </AdminField>
      </LetterFieldBlock>
    </div>
  )
}

