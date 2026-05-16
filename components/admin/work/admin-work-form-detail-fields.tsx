'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { WorkDetailPatch } from '@/lib/work-admin-types'

type Props = {
  detail: WorkDetailPatch
  setDetail: (patch: Partial<WorkDetailPatch>) => void
  rolesInput: string
}

/** Meta bar copy only — hero title, year, location, image, and tag pills all come from the listing fields above. */
export function AdminWorkFormDetailMetaFields({ detail: d, setDetail, rolesInput }: Props) {
  const [rolesDraft, setRolesDraft] = React.useState(rolesInput)

  React.useEffect(() => {
    setRolesDraft(rolesInput)
  }, [rolesInput])

  const roleTags = rolesDraft
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-base font-medium text-white">Meta bar and intro</p>
        <p className="mt-1 text-sm text-white/60">
          Here you add project type, roles, and the meta bar description.
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Project type</Label>
        <Input
          value={d.projectType ?? ''}
          onChange={(e) => setDetail({ projectType: e.target.value })}
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Roles (comma-separated)</Label>
        <Input
          value={rolesDraft}
          onChange={(e) => {
            const value = e.target.value
            setRolesDraft(value)
            setDetail({
              roles: value
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }}
          className="border-white/15 bg-background/30 text-white"
        />
        <p className="text-xs text-white/45">Add roles separated by commas (example: Designer, 3D Visualizer).</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {roleTags.length ? (
            roleTags.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/90"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-white/45">No roles added yet.</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Description (meta bar)</Label>
        <Textarea
          value={d.descriptionNote ?? ''}
          onChange={(e) => setDetail({ descriptionNote: e.target.value })}
          rows={5}
          placeholder="Short summary shown in the Description column under the hero"
          className="border-white/15 bg-background/30 text-white"
        />
      </div>
    </div>
  )
}

/** Alias for older imports / cached bundles. Prefer `AdminWorkFormDetailMetaFields`. */
export { AdminWorkFormDetailMetaFields as AdminWorkFormDetailFields }
