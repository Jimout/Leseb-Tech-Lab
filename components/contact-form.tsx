'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export type ContactFormProps = {
  className?: string
}

const pillInput = cn(
  'w-full rounded-[2rem] border-2 border-foreground/30 bg-transparent px-5 py-3.5 text-sm text-foreground shadow-none',
  'dark:border-white/55',
  'placeholder:text-muted-foreground outline-none transition-[border-color,box-shadow]',
  'focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/40',
)

const pillTextarea = cn(
  pillInput,
  'min-h-[11rem] resize-y rounded-[1.75rem] py-4 sm:min-h-[12.5rem] sm:rounded-[2rem]',
)

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive">{message}</p>
}

type DynamicValues = Record<string, unknown>

function autoCompleteForField(name: string, kind: string) {
  if (kind === 'email' || name.toLowerCase() === 'email') return 'email'
  if (kind === 'tel' || name.toLowerCase() === 'phone') return 'tel'
  if (name.toLowerCase() === 'name') return 'name'
  if (name.toLowerCase() === 'city') return 'off'
  return 'off'
}

function displayTextForField(field: { name: string; label: string; placeholder?: string }) {
  if (field.name.toLowerCase() === 'city') {
    return {
      label: 'Subject',
      placeholder: 'Subject',
    }
  }

  return {
    label: field.label,
    placeholder: field.placeholder ?? field.label,
  }
}

export function ContactForm({ className }: ContactFormProps) {
  const { settings } = useSiteSettings()
  const contact = settings.contact
  const { toast } = useToast()
  const [submitting, setSubmitting] = React.useState(false)

  const fields = contact.formFields.filter((f) => f.visible)
  const defaultValues = React.useMemo(() => {
    const out: DynamicValues = {}
    for (const f of fields) out[f.name] = ''
    out.newsletter = false
    return out
  }, [fields])

  const form = useForm<DynamicValues>({ defaultValues })

  async function onSubmit(values: DynamicValues) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Request failed')
      toast({ title: 'Message sent', description: 'Thanks — I will get back to you soon.' })
      form.reset()
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const { register, handleSubmit, formState } = form

  if (!contact.formVisible) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-5 sm:gap-6', className)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {fields
          .filter((f) => f.kind !== 'textarea')
          .map((f) => {
            const display = displayTextForField(f)
            return (
              <div key={f.id} className="space-y-1.5">
                <input
                  {...register(f.name, { required: Boolean(f.required) })}
                  type={f.kind === 'email' ? 'email' : f.kind === 'tel' ? 'tel' : 'text'}
                  className={pillInput}
                  placeholder={display.placeholder}
                  aria-label={display.label}
                  autoComplete={autoCompleteForField(f.name, f.kind)}
                />
                <FieldError message={(formState.errors as any)?.[f.name]?.message} />
              </div>
            )
          })}
      </div>

      {fields
        .filter((f) => f.kind === 'textarea')
        .map((f) => (
          <div key={f.id} className="space-y-1.5">
            <textarea
              {...register(f.name, { required: Boolean(f.required) })}
              className={pillTextarea}
              placeholder={f.placeholder ?? f.label}
              rows={6}
            />
            <FieldError message={(formState.errors as any)?.[f.name]?.message} />
          </div>
        ))}

      {contact.newsletterOptInVisible ? (
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            {...register('newsletter')}
            className="mt-1 size-4 shrink-0 rounded border-2 border-foreground/45 accent-accent dark:border-white/60"
          />
          <span>{contact.newsletterOptInLabel}</span>
        </label>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
        By submitting this form I accept the{' '}
        <Link
          href="/privacy"
          className="text-secondary underline-offset-2 hover:underline dark:text-accent"
        >
          Privacy Policy
        </Link>{' '}
        of this site.
      </p>

      <div className="pt-1">
        <FluidSplitButton label={contact.formSubmitLabel} type="submit" disabled={submitting} size="sm" />
      </div>
    </form>
  )
}
