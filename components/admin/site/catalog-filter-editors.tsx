'use client'

import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { AdminField } from '@/components/admin/pages/about/about-editorial-editors'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { PortfolioCatalogFilterEntry } from '@/lib/portfolio-catalog-filters'

export const catalogFilterFieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/40'

function slugifyTitle(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function resequenceCatalogFilters(entries: PortfolioCatalogFilterEntry[]): PortfolioCatalogFilterEntry[] {
  return entries.map((e, i) => ({ ...e, order: i * 10 }))
}

function moveIndex(list: PortfolioCatalogFilterEntry[], index: number, delta: -1 | 1) {
  const next = [...list]
  const j = index + delta
  if (j < 0 || j >= next.length) return list
  ;[next[index], next[j]] = [next[j], next[index]]
  return resequenceCatalogFilters(next)
}

export function CatalogCategoryFiltersEditor({
  entries,
  onChange,
}: {
  entries: PortfolioCatalogFilterEntry[]
  onChange: (next: PortfolioCatalogFilterEntry[]) => void
}) {
  const [newLabel, setNewLabel] = useState('')
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const updateAt = (index: number, patch: Partial<PortfolioCatalogFilterEntry>) => {
    onChange(resequenceCatalogFilters(entries.map((e, i) => (i === index ? { ...e, ...patch } : e))))
  }

  const removeAt = (index: number) => {
    const id = entries[index]?.id
    if (!id || id === 'all') return
    onChange(resequenceCatalogFilters(entries.filter((_, i) => i !== index)))
    setDeleteIndex(null)
  }

  const addEntry = () => {
    const label = newLabel.trim()
    if (!label) return
    let base = slugifyTitle(label) || 'filter'
    let id = base
    let n = 1
    while (entries.some((e) => e.id === id)) {
      id = `${base}-${n}`
      n += 1
    }
    onChange(resequenceCatalogFilters([...entries, { id, label, visible: true, order: entries.length * 10 }]))
    setNewLabel('')
  }

  const pendingRow = deleteIndex !== null ? entries[deleteIndex] : null

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-white/55">
        The first filter is always <span className="text-white/75">Explore all</span> — it cannot be removed. Assign
        categories when editing Work projects or Insights articles.
      </p>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent className="border-white/10 bg-[#141414] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/65">
              {pendingRow ? (
                <>
                  Remove <span className="font-medium text-white/90">&ldquo;{pendingRow.label}&rdquo;</span> (
                  <span className="tabular-nums">{pendingRow.id}</span>). Existing work or insights tagged with this id
                  will keep the id until you update them in their editors.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteIndex !== null && removeAt(deleteIndex)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-2">
        {entries.map((row, index) => (
          <div
            key={row.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                    {row.id === 'all' ? 'Show all' : `Category · ${row.id}`}
                  </p>
                  <AdminField label="Label shown on /work and /insights">
                    <Input
                      value={row.label}
                      onChange={(e) => updateAt(index, { label: e.target.value })}
                      className={catalogFilterFieldClass}
                    />
                  </AdminField>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:pt-6">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1.5">
                  <Switch
                    id={`vis-${row.id}`}
                    checked={row.visible}
                    disabled={row.id === 'all'}
                    onCheckedChange={(v) => updateAt(index, { visible: Boolean(v) })}
                  />
                  <Label htmlFor={`vis-${row.id}`} className="text-xs text-white/75">
                    Visible
                  </Label>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-8 text-white/70 hover:bg-white/10"
                  disabled={index <= 0}
                  onClick={() => onChange(moveIndex(entries, index, -1))}
                  aria-label="Move up"
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-8 text-white/70 hover:bg-white/10"
                  disabled={index >= entries.length - 1}
                  onClick={() => onChange(moveIndex(entries, index, 1))}
                  aria-label="Move down"
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-8 text-destructive hover:bg-destructive/15 hover:text-destructive"
                  disabled={row.id === 'all'}
                  onClick={() => setDeleteIndex(index)}
                  aria-label="Delete category"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-end">
        <AdminField label="New category" hint="Creates an id from the name (e.g. “Urban design” → urban-design).">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Product design"
            className={catalogFilterFieldClass}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addEntry()
              }
            }}
          />
        </AdminField>
        <Button type="button" variant="secondary" className="border-white/15 bg-white/5 text-white shrink-0" onClick={addEntry}>
          Add category
        </Button>
      </div>
    </div>
  )
}
