'use client'

import type { ReactNode } from 'react'

import { AdminWorkRepeatableImages } from '@/components/admin/work/admin-work-repeatable-images'
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

      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Story video & gallery</p>

        <FieldGroup
          label="Story video URL"
          hint="Shown below the facts row. Leave empty to use the default clip on seeded projects."
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

        <FieldGroup label="Below-video title">
          <Input
            value={d.storyVideoTitle ?? ''}
            onChange={(e) => setDetail({ storyVideoTitle: e.target.value })}
            placeholder="Headline under the video"
            className={fieldClass}
          />
        </FieldGroup>

        <FieldGroup label="Below-video description">
          <Textarea
            value={d.storyVideoDescription ?? ''}
            onChange={(e) => setDetail({ storyVideoDescription: e.target.value })}
            rows={4}
            placeholder="Copy under the below-video title"
            className={fieldClass}
          />
        </FieldGroup>

        <AdminWorkRepeatableImages
          label="Photo gallery"
          description="Up to 3 images — two on top, one full width below."
          items={d.storyGalleryImages ?? []}
          onChange={(storyGalleryImages) => setDetail({ storyGalleryImages })}
        />

        <FieldGroup label="Below-gallery title">
          <Input
            value={d.storyGalleryTitle ?? ''}
            onChange={(e) => setDetail({ storyGalleryTitle: e.target.value })}
            placeholder="Headline under the gallery"
            className={fieldClass}
          />
        </FieldGroup>

        <FieldGroup label="Below-gallery description">
          <Textarea
            value={d.storyGalleryDescription ?? ''}
            onChange={(e) => setDetail({ storyGalleryDescription: e.target.value })}
            rows={4}
            placeholder="Copy under the gallery grid"
            className={fieldClass}
          />
        </FieldGroup>
      </div>
    </div>
  )
}

export { AdminWorkFormDetailMetaFields as AdminWorkFormDetailFields }
