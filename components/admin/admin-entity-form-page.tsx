'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { SimpleForm, type Field } from '@/components/admin/simple-form'
import { Button } from '@/components/ui/button'
import { adminPanelSurfaceClass } from '@/lib/admin/admin-layout-classes'
import { cn } from '@/lib/utils'

export function AdminEntityFormPage<T extends Record<string, unknown>>({
  title,
  description,
  backHref,
  submitLabel,
  initial,
  fields,
  onSubmit,
}: {
  title: string
  description?: string
  backHref: string
  submitLabel: string
  initial: T
  fields: readonly Field[]
  onSubmit: (value: T) => void
}) {
  const router = useRouter()
  return (
    <AdminPageShell
      title={title}
      description={description}
      right={
        <Button asChild variant="secondary">
          <Link href={backHref}>Back</Link>
        </Button>
      }
    >
      <div
        className={cn(
          'w-full max-w-2xl xl:max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl',
          adminPanelSurfaceClass,
        )}
      >
        <SimpleForm<T>
          title=""
          submitLabel={submitLabel}
          initial={initial}
          fields={fields}
          onSubmit={(next) => {
            onSubmit(next)
            router.push(backHref)
          }}
        />
      </div>
    </AdminPageShell>
  )
}

