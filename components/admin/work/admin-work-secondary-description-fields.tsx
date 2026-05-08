'use client'

import * as React from 'react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { WorkDetailPatch } from '@/lib/work-admin-types'

export function normalizeFourParagraphs(cols?: string[]): [string, string, string, string] {
  const a = [...(cols ?? [])]
  while (a.length < 4) a.push('')
  return a.slice(0, 4) as [string, string, string, string]
}

type Props = {
  detail: WorkDetailPatch
  setDetail: (patch: Partial<WorkDetailPatch>) => void
}

export function AdminWorkSecondaryImageDescriptionFields({ detail: d, setDetail }: Props) {
  const cols = normalizeFourParagraphs(d.secondaryImageDescriptionColumns)

  const setPara = React.useCallback(
    (index: number, value: string) => {
      const next = [...cols]
      next[index] = value
      setDetail({ secondaryImageDescriptionColumns: next })
    },
    [cols, setDetail],
  )

  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-black/15 p-4">
      <div>
        <Label className="text-base text-white">Text under secondary hero (2×2 grid)</Label>
        <p className="mt-1 text-xs text-white/55">
          Four paragraphs — left column: 1 and 3, right column: 2 and 4. Shown only when a secondary hero image
          is set.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {([0, 1, 2, 3] as const).map((i) => (
          <div key={i} className="space-y-1.5">
            <Label className="text-xs text-white/70">Paragraph {i + 1}</Label>
            <Textarea
              value={cols[i]}
              onChange={(e) => setPara(i, e.target.value)}
              rows={4}
              className="border-white/15 bg-black/30 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
