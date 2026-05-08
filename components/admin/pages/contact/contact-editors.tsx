'use client'

import { useId } from 'react'
import { ArrowDown, ArrowUp, Check, ChevronsUpDown, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import type {
  ContactFormField,
  ContactFieldKind,
  ContactSocialIconId,
  ContactSocialLink,
} from '@/lib/admin/site-settings'
import { cn } from '@/lib/utils'

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function generatedFieldKey() {
  return `field_${crypto.randomUUID().replace(/-/g, '')}`
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/85">{label}</p>
      {children}
    </div>
  )
}

const KIND_OPTIONS: { value: ContactFieldKind; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'textarea', label: 'Textarea' },
]

function FieldCard({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  field: ContactFormField
  index: number
  total: number
  onChange: (next: ContactFormField) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const visibleId = useId()
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A1A1B] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor={visibleId} className="text-xs text-white/60">
            Visible
          </Label>
          <Switch
            id={visibleId}
            checked={field.visible}
            onCheckedChange={(v) => onChange({ ...field, visible: v })}
          />
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
            aria-label="Delete field"
            title="Delete field"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Row label="Label">
          <Input
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </Row>
        <Row label="Kind">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                className="w-full justify-between border border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                {KIND_OPTIONS.find((k) => k.value === field.kind)?.label ?? 'Select kind'}
                <ChevronsUpDown className="size-4 opacity-60" aria-hidden />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[--radix-popover-trigger-width] border-white/10 bg-[#101011] p-0">
              <Command className="bg-transparent text-white">
                <CommandInput placeholder="Search kind…" className="text-white placeholder:text-white/40" />
                <CommandList>
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup>
                    {KIND_OPTIONS.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.value}
                        onSelect={() => onChange({ ...field, kind: opt.value })}
                        className="text-white"
                      >
                        <Check
                          className={cn('size-4', field.kind === opt.value ? 'opacity-100' : 'opacity-0')}
                          aria-hidden
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </Row>
        <Row label="Placeholder">
          <Input
            value={field.placeholder ?? ''}
            onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </Row>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Switch checked={Boolean(field.required)} onCheckedChange={(v) => onChange({ ...field, required: v })} />
        <p className="text-sm text-white/70">Required</p>
      </div>
    </div>
  )
}

function SocialCard({
  link,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  link: ContactSocialLink
  index: number
  total: number
  onChange: (next: ContactSocialLink) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const visibleId = useId()
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A1A1B] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor={visibleId} className="text-xs text-white/60">
            Visible
          </Label>
          <Switch id={visibleId} checked={link.visible} onCheckedChange={(v) => onChange({ ...link, visible: v })} />
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
            aria-label="Delete social link"
            title="Delete social link"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Row label="Label">
          <Input
            value={link.label}
            onChange={(e) => onChange({ ...link, label: e.target.value })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </Row>
        <Row label="URL">
          <Input
            value={link.href}
            onChange={(e) => onChange({ ...link, href: e.target.value })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            placeholder="https://..."
          />
        </Row>
        <Row label="Icon id">
          <Input
            value={link.iconId}
            onChange={(e) => onChange({ ...link, iconId: e.target.value as ContactSocialIconId })}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            placeholder="instagram | tiktok | linkedin ..."
          />
        </Row>
      </div>
    </div>
  )
}

export function ContactFormFieldsEditor({
  fields,
  onChange,
}: {
  fields: ContactFormField[]
  onChange: (next: ContactFormField[]) => void
}) {
  return (
    <div className="space-y-4">
      {fields.map((f, idx) => (
        <FieldCard
          key={f.id}
          field={f}
          index={idx}
          total={fields.length}
          onChange={(next) => onChange(fields.map((x) => (x.id === f.id ? next : x)))}
          onDelete={() => onChange(fields.filter((x) => x.id !== f.id))}
          onMoveUp={() => {
            if (idx === 0) return
            const copy = [...fields]
            const a = copy[idx - 1]
            copy[idx - 1] = copy[idx]
            copy[idx] = a
            onChange(copy)
          }}
          onMoveDown={() => {
            if (idx === fields.length - 1) return
            const copy = [...fields]
            const a = copy[idx + 1]
            copy[idx + 1] = copy[idx]
            copy[idx] = a
            onChange(copy)
          }}
        />
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          onChange([
            ...fields,
            {
              id: uid('field'),
              visible: true,
              name: generatedFieldKey(),
              label: 'New field',
              kind: 'text',
              placeholder: '',
              required: false,
            },
          ])
        }
      >
        Add field
      </Button>
    </div>
  )
}

export function ContactSocialLinksEditor({
  links,
  onChange,
}: {
  links: ContactSocialLink[]
  onChange: (next: ContactSocialLink[]) => void
}) {
  return (
    <div className="space-y-4">
      {links.map((l, idx) => (
        <SocialCard
          key={l.id}
          link={l}
          index={idx}
          total={links.length}
          onChange={(next) => onChange(links.map((x) => (x.id === l.id ? next : x)))}
          onDelete={() => onChange(links.filter((x) => x.id !== l.id))}
          onMoveUp={() => {
            if (idx === 0) return
            const copy = [...links]
            const a = copy[idx - 1]
            copy[idx - 1] = copy[idx]
            copy[idx] = a
            onChange(copy)
          }}
          onMoveDown={() => {
            if (idx === links.length - 1) return
            const copy = [...links]
            const a = copy[idx + 1]
            copy[idx + 1] = copy[idx]
            copy[idx] = a
            onChange(copy)
          }}
        />
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          onChange([
            ...links,
            { id: uid('social'), visible: true, label: 'New', href: '', iconId: 'instagram' },
          ])
        }
      >
        Add social link
      </Button>
    </div>
  )
}

