'use client'

import type { ReactNode } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { WorkDetailPatch } from '@/lib/work-admin-types'
import { cn } from '@/lib/utils'

const fieldClass = 'border-white/15 bg-background/30 text-white'

function FieldGroup({
  label,
  hint,
  children,
  className,
  labelClassName = 'text-white/80',
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
  labelClassName?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className={labelClassName}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-white/45">{hint}</p> : null}
    </div>
  )
}

function SectionDivider() {
  return <div className="border-t border-white/10 pt-1" aria-hidden />
}

type Props = {
  detail: WorkDetailPatch
  setDetail: (patch: Partial<WorkDetailPatch>) => void
  labelClassName?: string
  fieldClassName?: string
}

/** Case study fields in the same order as the live project page. */
export function AdminWorkFormDetailMetaFields({
  detail: d,
  setDetail,
  labelClassName = 'text-white/80',
  fieldClassName = fieldClass,
}: Props) {
  const industryValue = d.industry?.trim() || d.projectType?.trim() || ''

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup
        label="Case study title"
        hint="Headline in the left column of the case study intro (can differ from the work card title)."
        labelClassName={labelClassName}
      >
        <Input
          value={d.pageTitle ?? ''}
          onChange={(e) => setDetail({ pageTitle: e.target.value })}
          placeholder="e.g. Client name or project headline"
          className={fieldClassName}
        />
      </FieldGroup>

      <FieldGroup
        label="Case study description"
        hint="Main paragraph in the right column beside the title and gallery."
        labelClassName={labelClassName}
      >
        <Textarea
          value={d.descriptionNote ?? ''}
          onChange={(e) => setDetail({ descriptionNote: e.target.value })}
          rows={6}
          placeholder="Project overview — same tone as your case study intro"
          className={fieldClassName}
        />
      </FieldGroup>

      <SectionDivider />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Project facts</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldGroup label="Client" labelClassName={labelClassName}>
            <Input
              value={d.client ?? ''}
              onChange={(e) => setDetail({ client: e.target.value })}
              placeholder="e.g. Leseb Tech Lab"
              className={fieldClassName}
            />
          </FieldGroup>
          <FieldGroup label="Industry" labelClassName={labelClassName}>
            <Input
              value={industryValue}
              onChange={(e) => setDetail({ industry: e.target.value, projectType: e.target.value })}
              placeholder="e.g. AI"
              className={fieldClassName}
            />
          </FieldGroup>
          <FieldGroup label="Duration" labelClassName={labelClassName}>
            <Input
              value={d.duration ?? d.solution ?? ''}
              onChange={(e) => setDetail({ duration: e.target.value })}
              placeholder="e.g. 16 Weeks"
              className={fieldClassName}
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  )
}

export { AdminWorkFormDetailMetaFields as AdminWorkFormDetailFields }
