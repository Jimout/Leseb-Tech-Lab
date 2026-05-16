'use client'

import * as React from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { adminPanelSurfaceClass } from '@/lib/admin/admin-layout-classes'
import type { PortfolioCatalogFilterEntry } from '@/lib/portfolio-catalog-filters'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, ChevronDown, Trash2 } from 'lucide-react'

function slugifyTitle(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resequence(entries: PortfolioCatalogFilterEntry[]): PortfolioCatalogFilterEntry[] {
  return entries.map((e, i) => ({ ...e, order: i * 10 }))
}

function moveIndex(list: PortfolioCatalogFilterEntry[], index: number, delta: -1 | 1) {
  const next = [...list]
  const j = index + delta
  if (j < 0 || j >= next.length) return list
  ;[next[index], next[j]] = [next[j], next[index]]
  return resequence(next)
}

function CatalogFilterSection({
  title,
  description,
  entries,
  onChange,
  addPlaceholder,
  defaultExpanded = true,
}: {
  title: string
  description: string
  entries: PortfolioCatalogFilterEntry[]
  onChange: (next: PortfolioCatalogFilterEntry[]) => void
  addPlaceholder: string
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [newLabel, setNewLabel] = React.useState('')
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null)

  const updateAt = (index: number, patch: Partial<PortfolioCatalogFilterEntry>) => {
    const next = entries.map((e, i) => (i === index ? { ...e, ...patch } : e))
    onChange(resequence(next))
  }

  const removeAt = (index: number) => {
    const id = entries[index]?.id
    if (!id || id === 'all') return
    onChange(resequence(entries.filter((_, i) => i !== index)))
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
    onChange(resequence([...entries, { id, label, visible: true, order: entries.length * 10 }]))
    setNewLabel('')
  }

  const pendingRow = deleteIndex !== null ? entries[deleteIndex] : null

  return (
    <Card className={cn(adminPanelSurfaceClass, 'border-white/10 p-5 sm:p-6')}>
      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent className="border-white/10 bg-[#141416] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this filter?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/65">
              {pendingRow ? (
                <>
                  Remove <span className="font-medium text-white/90">&ldquo;{pendingRow.label}&rdquo;</span>{' '}
                  <span className="tabular-nums text-white/50">({pendingRow.id})</span> from the catalog. Projects,
                  articles, or resources that still use this id will not be updated automatically—adjust them in their
                  editors if needed.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-transparent text-white hover:bg-white/10">
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

      <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${title}`}
          className="flex w-full items-start gap-3 rounded-lg text-left outline-none transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/25 -m-1 p-1 sm:items-center"
        >
          <ChevronDown
            className={cn(
              'mt-0.5 size-5 shrink-0 text-white/70 transition-transform duration-200',
              expanded && 'rotate-180',
            )}
            aria-hidden
          />
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-semibold text-white">{title}</span>
            <span className="mt-1 block text-sm text-white/55">{description}</span>
          </span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden">
      <div className="mt-6 space-y-3">
        {entries.map((row, index) => (
          <div
            key={row.id}
            className="flex flex-col gap-3 rounded-lg border border-white/10 bg-background/25 px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <Label className="text-xs text-white/50">Label</Label>
              <Input
                value={row.label}
                onChange={(e) => updateAt(index, { label: e.target.value })}
                className="border-white/15 bg-background/30 text-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
              <div className="flex items-center gap-2">
                <Switch
                  id={`vis-${row.id}`}
                  checked={row.visible}
                  disabled={row.id === 'all'}
                  onCheckedChange={(v) => updateAt(index, { visible: Boolean(v) })}
                />
                <Label htmlFor={`vis-${row.id}`} className="text-sm text-white/80">
                  Visible
                </Label>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 px-2"
                  disabled={index <= 0}
                  onClick={() => onChange(moveIndex(entries, index, -1))}
                  aria-label="Move up"
                >
                  <ArrowUp className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 px-2"
                  disabled={index >= entries.length - 1}
                  onClick={() => onChange(moveIndex(entries, index, 1))}
                  aria-label="Move down"
                >
                  <ArrowDown className="size-4" aria-hidden />
                </Button>
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0"
                disabled={row.id === 'all'}
                onClick={() => setDeleteIndex(index)}
                aria-label="Delete filter"
                title="Delete filter"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1">
          <Label className="text-white/70">Add filter</Label>
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder={addPlaceholder}
            className="border-white/15 bg-background/30 text-white"
          />
        </div>
        <Button type="button" variant="secondary" className="sm:mb-0" onClick={addEntry}>
          Add
        </Button>
      </div>
      </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export function AdminPortfolioCatalogFiltersPage() {
  const { settings, patch, ready } = useSiteSettings()
  const [cancelOpen, setCancelOpen] = React.useState(false)
  const [workInsights, setWorkInsights] = React.useState<PortfolioCatalogFilterEntry[]>(
    () => settings.portfolioCatalogFilters.workInsights,
  )

  React.useEffect(() => {
    if (!ready) return
    setWorkInsights([...settings.portfolioCatalogFilters.workInsights])
  }, [ready, settings.portfolioCatalogFilters])

  const serverWork = JSON.stringify(settings.portfolioCatalogFilters.workInsights)
  const changed = JSON.stringify(workInsights) !== serverWork

  const save = () => {
    patch({
      portfolioCatalogFilters: {
        workInsights: resequence(workInsights),
      },
    })
  }

  const discardDraft = () => {
    setWorkInsights([...settings.portfolioCatalogFilters.workInsights])
    setCancelOpen(false)
  }

  return (
    <AdminPageShell
      title="Catalog filters"
      description="Control filter labels, order, and visibility for Work and Insights. Counts on the public site still come from your content."
      right={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="secondary" disabled={!changed}>
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-[#141416] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Discard catalog changes?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/65">
                  Unsaved edits to Work &amp; Insights filters will be reverted to the last saved catalog. Nothing is
                  written to the site until you click Save.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/15 bg-transparent text-white hover:bg-white/10">
                  Keep editing
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={discardDraft}
                >
                  Discard changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button type="button" onClick={save} disabled={!changed}>
            Save
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <CatalogFilterSection
          title="Work & Insights"
          description="Same filter bar on /work and /insights. Match each project or article’s filter checkboxes to these ids."
          entries={workInsights}
          onChange={setWorkInsights}
          addPlaceholder="e.g. Urban design"
        />
      </div>
    </AdminPageShell>
  )
}
