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
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-white/80">{label}</Label>
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
}

/** Case study fields in the same order as the live project page. */
export function AdminWorkFormDetailMetaFields({ detail: d, setDetail }: Props) {
  const industryValue = d.industry?.trim() || d.projectType?.trim() || ''

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup label="Intro description" hint="Main case study paragraph beside the gallery column.">
        <Textarea
          value={d.descriptionNote ?? ''}
          onChange={(e) => setDetail({ descriptionNote: e.target.value })}
          rows={6}
          placeholder="Project overview — same tone as your case study intro"
          className={fieldClass}
        />
      </FieldGroup>

      <SectionDivider />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Project facts</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldGroup label="Client">
            <Input
              value={d.client ?? ''}
              onChange={(e) => setDetail({ client: e.target.value })}
              placeholder="e.g. Leseb Tech Lab"
              className={fieldClass}
            />
          </FieldGroup>
          <FieldGroup label="Industry">
            <Input
              value={industryValue}
              onChange={(e) => setDetail({ industry: e.target.value, projectType: e.target.value })}
              placeholder="e.g. AI"
              className={fieldClass}
            />
          </FieldGroup>
          <FieldGroup label="Duration">
            <Input
              value={d.duration ?? d.solution ?? ''}
              onChange={(e) => setDetail({ duration: e.target.value })}
              placeholder="e.g. 16 Weeks"
              className={fieldClass}
            />
          </FieldGroup>
        </div>
      </div>

      <SectionDivider />

      <FieldGroup
        label="Story video URL"
        hint="Full-width video on the project page. Add flexible sections below it in the next panel."
      >
        <Input
          value={d.storyVideo?.url ?? ''}
          onChange={(e) => {
            const url = e.target.value.trim()
            setDetail({
              storyVideo: url ? { type: 'video', url, alt: d.storyVideo?.alt ?? '' } : undefined,
            })
          }}
          placeholder="e.g. /0001-0120.mp4 or https://..."
          className={fieldClass}
        />
      </FieldGroup>
    </div>
  )
}

export { AdminWorkFormDetailMetaFields as AdminWorkFormDetailFields }
