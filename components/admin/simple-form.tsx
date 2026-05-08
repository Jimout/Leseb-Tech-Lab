'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export type Field =
  | { key: string; label: string; kind: 'text'; placeholder?: string }
  | { key: string; label: string; kind: 'textarea'; placeholder?: string; rows?: number }

export function SimpleForm<T extends Record<string, unknown>>({
  title,
  fields,
  initial,
  onSubmit,
  onChange,
  submitLabel,
  className,
}: {
  title: string
  fields: readonly Field[]
  initial: T
  onSubmit: (value: T) => void
  onChange?: (value: T) => void
  submitLabel?: string
  className?: string
}) {
  const [value, setValue] = React.useState<T>(initial)

  React.useEffect(() => setValue(initial), [initial])

  return (
    <form
      className={cn('space-y-4 sm:space-y-5 lg:space-y-6 xl:space-y-6', className)}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
      }}
    >
      {title ? (
        <p className="text-sm font-semibold text-white sm:text-base lg:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl">
          {title}
        </p>
      ) : null}
      {fields.map((f) => {
        const v = (value[f.key] ?? '') as string
        return (
          <div key={f.key} className="space-y-2">
            <Label className="text-sm text-white/80 sm:text-base lg:text-[15px] 2xl:text-base 3xl:text-lg">
              {f.label}
            </Label>
            {f.kind === 'textarea' ? (
              <Textarea
                value={v}
                rows={f.rows ?? 4}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setValue((p) => {
                    const next = { ...p, [f.key]: e.target.value } as T
                    onChange?.(next)
                    return next
                  })
                }
                className="bg-background/5 text-white"
              />
            ) : (
              <Input
                value={v}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setValue((p) => {
                    const next = { ...p, [f.key]: e.target.value } as T
                    onChange?.(next)
                    return next
                  })
                }
                className="bg-background/5 text-white"
              />
            )}
          </div>
        )
      })}
      {submitLabel ? (
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      ) : null}
    </form>
  )
}

