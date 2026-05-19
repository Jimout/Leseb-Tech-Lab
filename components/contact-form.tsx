'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { useToast } from '@/hooks/use-toast'
import { typeLabel } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

export type ContactFormProps = {
  className?: string
}

const fieldInputClass = cn(
  'w-full rounded-lg border border-border bg-background px-4 py-3',
  'font-sans text-sm text-foreground placeholder:text-muted-foreground',
  'outline-none transition-[border-color,box-shadow]',
  'focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-signal/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

const fieldTextareaClass = cn(fieldInputClass, 'min-h-[10rem] resize-y py-3 sm:min-h-[11rem]')

const fieldLabelClass = cn(typeLabel, 'text-muted-foreground')

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive">{message}</p>
}

type DynamicValues = Record<string, unknown>

function autoCompleteForField(name: string, kind: string) {
  if (kind === 'email' || name.toLowerCase() === 'email') return 'email'
  if (kind === 'tel' || name.toLowerCase() === 'phone') return 'tel'
  if (name.toLowerCase() === 'name') return 'name'
  return 'off'
}

function displayTextForField(field: { name: string; label: string; placeholder?: string }) {
  if (field.name.toLowerCase() === 'city') {
    return { label: 'Subject', placeholder: 'What is this about?' }
  }
  return { label: field.label, placeholder: field.placeholder ?? field.label }
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

      const wantsNewsletter = Boolean(values.newsletter)
      const subscriberEmail = typeof values.email === 'string' ? values.email.trim() : ''
      if (wantsNewsletter && subscriberEmail) {
        try {
          await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: subscriberEmail,
              notifyWork: true,
              notifyInsights: true,
              notifyImportant: true,
            }),
          })
        } catch {
          /* Message was sent; newsletter signup is best-effort. */
        }
      }

      toast({
        title: 'Message sent',
        description: wantsNewsletter
          ? 'Thanks, we will get back to you soon. Check your inbox to confirm our newsletter.'
          : 'Thanks, we will get back to you soon.',
      })
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

  const inputFields = fields.filter((f) => f.kind !== 'textarea')
  const textareaFields = fields.filter((f) => f.kind === 'textarea')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-6 sm:gap-7', className)}>
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        {inputFields.map((f) => {
          const display = displayTextForField(f)
          return (
            <div key={f.id} className={cn('space-y-2', f.name === 'project' && 'sm:col-span-2')}>
              <label htmlFor={`contact-${f.name}`} className={fieldLabelClass}>
                {display.label}
                {f.required ? <span className="text-signal"> *</span> : null}
              </label>
              <input
                id={`contact-${f.name}`}
                {...register(f.name, { required: Boolean(f.required) })}
                type={f.kind === 'email' ? 'email' : f.kind === 'tel' ? 'tel' : 'text'}
                className={fieldInputClass}
                placeholder={display.placeholder}
                autoComplete={autoCompleteForField(f.name, f.kind)}
              />
              <FieldError message={(formState.errors as Record<string, { message?: string }>)?.[f.name]?.message} />
            </div>
          )
        })}
      </div>

      {textareaFields.map((f) => {
        const display = displayTextForField(f)
        return (
          <div key={f.id} className="space-y-2">
            <label htmlFor={`contact-${f.name}`} className={fieldLabelClass}>
              {display.label}
              {f.required ? <span className="text-signal"> *</span> : null}
            </label>
            <textarea
              id={`contact-${f.name}`}
              {...register(f.name, { required: Boolean(f.required) })}
              className={fieldTextareaClass}
              placeholder={display.placeholder}
              rows={6}
            />
            <FieldError message={(formState.errors as Record<string, { message?: string }>)?.[f.name]?.message} />
          </div>
        )
      })}

      {contact.newsletterOptInVisible ? (
        <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-6 text-sm text-foreground/90">
          <input
            type="checkbox"
            {...register('newsletter')}
            className="mt-0.5 size-4 shrink-0 rounded border-border accent-signal"
          />
          <span>{contact.newsletterOptInLabel}</span>
        </label>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
        By submitting this form you accept our{' '}
        <Link href={contact.privacyPolicyHref || '/privacy'} className="text-signal hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <div>
        <FluidSplitButton
          label={contact.formSubmitLabel}
          type="submit"
          disabled={submitting}
          variant="secondary"
          size="navbar"
        />
      </div>
    </form>
  )
}
