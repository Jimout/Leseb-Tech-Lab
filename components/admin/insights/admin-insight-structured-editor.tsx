'use client'

import * as React from 'react'

import { AdminRichTextEditor } from '@/components/admin/admin-rich-text-editor'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { InsightArticle, InsightSectionBlock } from '@/lib/insight-types'
import { slugifyHeading } from '@/lib/slugify'
import { cn } from '@/lib/utils'

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)
}

type PEdit = { si: number; bi: number }

export function AdminInsightStructuredEditor({
  value,
  onChange,
}: {
  value: InsightArticle
  onChange: (a: InsightArticle) => void
}) {
  const [pEdit, setPEdit] = React.useState<PEdit | null>(null)
  const [draftHtml, setDraftHtml] = React.useState('')

  const sections = value.sections

  const updateSections = (next: typeof sections) => {
    onChange({ ...value, sections: next })
  }

  const openParagraph = (si: number, bi: number, html: string) => {
    setDraftHtml(html || '<p></p>')
    setPEdit({ si, bi })
  }

  const saveParagraph = () => {
    if (!pEdit) return
    const { si, bi } = pEdit
    const next = sections.map((s, i) => {
      if (i !== si) return s
      const blocks = s.blocks.map((b, j) =>
        j === bi && b.type === 'p' ? { type: 'p' as const, html: draftHtml } : b,
      )
      return { ...s, blocks }
    })
    updateSections(next)
    setPEdit(null)
  }

  const addSection = () => {
    const id = `section-${sections.length + 1}`
    updateSections([
      ...sections,
      { id, heading: 'New section', blocks: [{ type: 'p', html: '<p></p>' }] },
    ])
  }

  const addBlock = (si: number, kind: 'p' | 'ul' | 'ol') => {
    const block: InsightSectionBlock =
      kind === 'p'
        ? { type: 'p', html: '<p></p>' }
        : { type: kind, items: [''] }
    const next = sections.map((s, i) =>
      i === si ? { ...s, blocks: [...s.blocks, block] } : s,
    )
    updateSections(next)
  }

  const removeBlock = (si: number, bi: number) => {
    const next = sections.map((s, i) =>
      i === si ? { ...s, blocks: s.blocks.filter((_, j) => j !== bi) } : s,
    )
    updateSections(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-white/70">
          Sections drive the table of contents (order = TOC order). Each section has a heading anchor id.
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={addSection}>
          Add section
        </Button>
      </div>

      {sections.map((sec, si) => (
        <div
          key={`${sec.id}-${si}`}
          className={cn('space-y-3 rounded-lg border border-white/10 bg-white/5 p-4')}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-white/80">Section heading</Label>
              <Input
                value={sec.heading}
                onChange={(e) => {
                  const heading = e.target.value
                  const id = slugifyHeading(heading)
                  const next = sections.map((s, i) =>
                    i === si ? { ...s, heading, id } : s,
                  )
                  updateSections(next)
                }}
                className="border-white/15 bg-black/30 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/80">Anchor id (slug)</Label>
              <Input
                value={sec.id}
                onChange={(e) => {
                  const id = e.target.value
                  const next = sections.map((s, i) => (i === si ? { ...s, id } : s))
                  updateSections(next)
                }}
                className="border-white/15 bg-black/30 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Blocks</Label>
            {sec.blocks.map((b, bi) => (
              <div
                key={bi}
                className="flex flex-col gap-2 rounded-md border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-start"
              >
                <span className="shrink-0 text-xs font-medium uppercase text-accent">
                  {b.type}
                </span>
                {b.type === 'p' ? (
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-xs text-white/60">{stripTags(b.html) || '(empty)'}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-white/20"
                      onClick={() => openParagraph(si, bi, b.html)}
                    >
                      Edit paragraph (rich text)
                    </Button>
                  </div>
                ) : (
                  <Textarea
                    value={b.items.join('\n')}
                    onChange={(e) => {
                      const items = e.target.value.split('\n')
                      const next = sections.map((s, i) => {
                        if (i !== si) return s
                        const blocks = s.blocks.map((bl, j) =>
                          j === bi && bl.type !== 'p' ? { ...bl, items } : bl,
                        )
                        return { ...s, blocks }
                      })
                      updateSections(next)
                    }}
                    rows={Math.min(8, Math.max(3, b.items.length))}
                    className="min-h-0 flex-1 border-white/15 bg-black/30 text-sm text-white"
                    placeholder="One list item per line"
                  />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => removeBlock(si, bi)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="button" variant="secondary" size="sm" onClick={() => addBlock(si, 'p')}>
                + Paragraph
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => addBlock(si, 'ul')}>
                + Bullets
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => addBlock(si, 'ol')}>
                + Numbered
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={pEdit !== null} onOpenChange={(o) => !o && setPEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/15 bg-[#1a1a1c] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit paragraph</DialogTitle>
          </DialogHeader>
          <AdminRichTextEditor value={draftHtml} onChange={setDraftHtml} minHeightClass="min-h-[240px]" />
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="secondary" onClick={() => setPEdit(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveParagraph}>
              Save paragraph
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
