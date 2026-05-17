'use client'

import { AdminWorkRepeatableImages } from '@/components/admin/work/admin-work-repeatable-images'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { WorkDetailPatch } from '@/lib/work-admin-types'

type Props = {
  detail: WorkDetailPatch
  setDetail: (patch: Partial<WorkDetailPatch>) => void
}

/** Project page copy — description plus Client / Industry / Solution row. */
export function AdminWorkFormDetailMetaFields({ detail: d, setDetail }: Props) {
  const industryValue = d.industry?.trim() || d.projectType?.trim() || ''

  return (
    <div className="space-y-4">
      <div>
        <p className="text-base font-medium text-white">Project story</p>
        <p className="mt-1 text-sm text-white/60">
          Description, story video, and the facts row (Client, Industry, Duration).
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Description</Label>
        <Textarea
          value={d.descriptionNote ?? ''}
          onChange={(e) => setDetail({ descriptionNote: e.target.value })}
          rows={6}
          placeholder="Project overview — same tone as your case study intro"
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Story video URL</Label>
        <Input
          value={d.storyVideo?.url ?? ''}
          onChange={(e) => {
            const url = e.target.value.trim()
            setDetail({
              storyVideo: url ? { type: 'video', url, alt: d.storyVideo?.alt ?? '' } : undefined,
            })
          }}
          placeholder="e.g. /0001-0120.mp4 or https://..."
          className="border-white/15 bg-background/30 text-white"
        />
        <p className="text-xs text-white/50">
          Shown below the facts row, same size as the hero image. Leave empty for the default clip.
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Below-video title</Label>
        <Input
          value={d.storyVideoTitle ?? ''}
          onChange={(e) => setDetail({ storyVideoTitle: e.target.value })}
          placeholder="Separate from the page title"
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Below-video description</Label>
        <Textarea
          value={d.storyVideoDescription ?? ''}
          onChange={(e) => setDetail({ storyVideoDescription: e.target.value })}
          rows={4}
          placeholder="Separate from the intro description above the facts"
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
      <AdminWorkRepeatableImages
        label="Below-video gallery"
        description="Up to 3 photos: two columns on top, one full width below."
        items={d.storyGalleryImages ?? []}
        onChange={(storyGalleryImages) => setDetail({ storyGalleryImages })}
      />
      <div className="space-y-2">
        <Label className="text-white/80">Below-gallery title</Label>
        <Input
          value={d.storyGalleryTitle ?? ''}
          onChange={(e) => setDetail({ storyGalleryTitle: e.target.value })}
          placeholder="Separate from the below-video title"
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Below-gallery description</Label>
        <Textarea
          value={d.storyGalleryDescription ?? ''}
          onChange={(e) => setDetail({ storyGalleryDescription: e.target.value })}
          rows={4}
          placeholder="Shown under the photo grid"
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-white/80">Client</Label>
          <Input
            value={d.client ?? ''}
            onChange={(e) => setDetail({ client: e.target.value })}
            placeholder="e.g. Leseb Tech Lab"
            className="border-white/15 bg-background/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Industry</Label>
          <Input
            value={industryValue}
            onChange={(e) => setDetail({ industry: e.target.value, projectType: e.target.value })}
            placeholder="e.g. AI"
            className="border-white/15 bg-background/30 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Duration</Label>
          <Input
            value={d.duration ?? d.solution ?? ''}
            onChange={(e) => setDetail({ duration: e.target.value })}
            placeholder="e.g. 16 Weeks"
            className="border-white/15 bg-background/30 text-white"
          />
        </div>
      </div>
    </div>
  )
}

/** Alias for older imports / cached bundles. Prefer `AdminWorkFormDetailMetaFields`. */
export { AdminWorkFormDetailMetaFields as AdminWorkFormDetailFields }
