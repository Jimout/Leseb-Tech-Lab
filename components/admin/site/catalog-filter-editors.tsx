'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'

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

export const catalogFilterFieldClass =
  'border-white/15 bg-white/5 text-white placeholder:text-white/40'

function slugifyTitle(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function resequenceCatalogFilters(
  entries: PortfolioCatalogFilterEntry[],
): PortfolioCatalogFilterEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    order: index * 10,
  }))
}

function moveIndex(
  list: PortfolioCatalogFilterEntry[],
  index: number,
  delta: -1 | 1,
): PortfolioCatalogFilterEntry[] {
  const next = [...list]
  const targetIndex = index + delta

  if (targetIndex < 0 || targetIndex >= next.length) {
    return list
  }

  ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]

  return resequenceCatalogFilters(next)
}

export function CatalogCategoryFiltersEditor({
  entries,
  onChange,
  onAddCategory,
  saving = false,
}: {
  entries: PortfolioCatalogFilterEntry[]
  onChange: (next: PortfolioCatalogFilterEntry[]) => void
  onAddCategory?: (label: string) => Promise<void>
  saving?: boolean
}) {
  const [newLabel, setNewLabel] = useState('')
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  function updateAt(index: number, patch: Partial<PortfolioCatalogFilterEntry>) {
    onChange(
      resequenceCatalogFilters(
        entries.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, ...patch } : entry,
        ),
      ),
    )
  }

  function removeAt(index: number) {
    const id = entries[index]?.id

    if (!id || id === 'all') return

    onChange(resequenceCatalogFilters(entries.filter((_, entryIndex) => entryIndex !== index)))
    setDeleteIndex(null)
  }

  async function addEntry() {
    const label = newLabel.trim()
    if (!label) return

    if (onAddCategory) {
      setIsAdding(true)
      try {
        await onAddCategory(label)
        setNewLabel('')
      } catch (error) {
        console.error('Failed to add category:', error)
      } finally {
        setIsAdding(false)
      }
    } else {
      // Fallback to local addition if no API function provided
      const base = slugifyTitle(label) || 'filter'
      let id = base
      let n = 1

      while (entries.some((entry) => entry.id === id)) {
        id = `${base}-${n}`
        n += 1
      }

      onChange(
        resequenceCatalogFilters([
          ...entries,
          {
            id,
            label,
            visible: true,
            order: entries.length * 10,
          },
        ]),
      )

      setNewLabel('')
    }
  }

  const pendingRow = deleteIndex !== null ? entries[deleteIndex] : null

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-white/55">
        {entries.length === 0 ? (
          <>Start by adding your first category below. Categories will appear as filters on /work and /insights pages.</>
        ) : (
          <>
            The first filter is always <span className="text-white/75">Explore all</span> — it
            cannot be removed. Assign categories when editing Work projects or Insights articles.
          </>
        )}
      </p>

      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteIndex(null)
        }}
      >
        <AlertDialogContent className="border-white/10 bg-[#141414] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/65">
              {pendingRow ? (
                <>
                  Remove{' '}
                  <span className="font-medium text-white/90">
                    &ldquo;{pendingRow.label}&rdquo;
                  </span>{' '}
                  (<span className="tabular-nums">{pendingRow.id}</span>). Existing work or
                  insights tagged with this id will keep the id until you update them in their
                  editors.
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
              onClick={() => {
                if (deleteIndex !== null) {
                  removeAt(deleteIndex)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((row, index) => (
            <div key={row.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                      {row.id === 'all' ? 'Show all' : `Category · ${row.id}`}
                    </p>

                    <AdminField label="Label shown on /work and /insights">
                      <Input
                        value={row.label}
                        onChange={(event) => updateAt(index, { label: event.target.value })}
                        className={catalogFilterFieldClass}
                        disabled={saving}
                      />
                    </AdminField>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:pt-6">
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1.5">
                    <Switch
                      id={`vis-${row.id}`}
                      checked={row.visible}
                      disabled={row.id === 'all' || saving}
                      onCheckedChange={(value) => updateAt(index, { visible: Boolean(value) })}
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
                    disabled={index <= 0 || saving}
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
                    disabled={index >= entries.length - 1 || saving}
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
                    disabled={row.id === 'all' || saving}
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
      )}

      <div className="flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-end">
        <AdminField
          label="New category"
          hint="Creates an id from the name, for example “Urban design” → urban-design."
        >
          <Input
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            placeholder="e.g. Product design"
            className={catalogFilterFieldClass}
            disabled={saving || isAdding}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addEntry()
              }
            }}
          />
        </AdminField>

        <Button
          type="button"
          variant="secondary"
          className="shrink-0 border-white/15 bg-white/5 text-white"
          onClick={addEntry}
          disabled={saving || isAdding || !newLabel.trim()}
        >
          {isAdding ? 'Adding...' : 'Add category'}
        </Button>
      </div>
    </div>
  )
}