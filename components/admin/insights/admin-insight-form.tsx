'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AdminRichTextEditor } from '@/components/admin/admin-rich-text-editor'
import { AdminInsightStructuredEditor } from '@/components/admin/insights/admin-insight-structured-editor'
import { AdminInsightHeroImageField } from '@/components/admin/insights/admin-insight-hero-image-field'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buildWorkInsightFilterChecklistOptions } from '@/lib/portfolio-catalog-filters'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { adminPanelSurfaceClass } from '@/lib/admin/admin-layout-classes'
import type { InsightArticle } from '@/lib/insight-types'
import { insightHref, type InsightBodyMode, type ShowcaseInsight } from '@/lib/insights-showcase-data'

import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'
import { slugifyTitle } from '@/lib/slug-format'
import { cn } from '@/lib/utils'
import type { MediaAsset } from '@/lib/media-assets'

import { buildInsightPayload, insightRowSnapshot } from './admin-insight-form-helpers'
import { emptyInsight, type InsightRow } from './admin-insight-fields'

function defaultArticle(): InsightArticle {
  return {
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        blocks: [{ type: 'p', html: '<p></p>' }],
      },
    ],
  }
}

function normalizeInsightRow(initial: InsightRow): InsightRow {
  return {
    ...emptyInsight(),
    ...initial,
    slug: initial.slug || (!initial.id ? slugifyTitle(initial.title) : ''),
    filterIds: [...initial.filterIds],
    bodyMode: initial.bodyMode ?? (initial.article ? 'structured' : 'simple'),
    simpleBodyHtml: initial.simpleBodyHtml ?? '<p></p>',
    article: initial.article,
  }
}

export function AdminInsightFormPage({
  title,
  description,
  backHref,
  submitLabel,
  initial,
  onSubmit,
  confirmUpdate = false,
}: {
  title: string
  description?: string
  backHref: string
  submitLabel: string
  initial: InsightRow
  onSubmit: (value: InsightRow) => Promise<boolean> | boolean
  confirmUpdate?: boolean
}) {
  const router = useRouter()
  const { settings } = useSiteSettings()
  const filterOptions = React.useMemo(
    () => buildWorkInsightFilterChecklistOptions(settings.portfolioCatalogFilters.workInsights),
    [settings.portfolioCatalogFilters.workInsights],
  )
  const slugSyncedRef = React.useRef(!initial.id)
  const savedSnapshotRef = React.useRef(insightRowSnapshot(normalizeInsightRow(initial)))

  const [row, setRow] = React.useState<InsightRow>(() => normalizeInsightRow(initial))

  React.useEffect(() => {
    slugSyncedRef.current = !initial.id
    const next = normalizeInsightRow(initial)
    savedSnapshotRef.current = insightRowSnapshot(next)
    setRow(next)
  }, [initial])

  React.useEffect(() => {
    if (!slugSyncedRef.current) return
    setRow((r) => ({ ...r, slug: slugifyTitle(r.title) }))
  }, [row.title])

  const mode: InsightBodyMode = row.bodyMode ?? 'simple'
  const changed = insightRowSnapshot(row) !== savedSnapshotRef.current

  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [discardOpen, setDiscardOpen] = React.useState(false)
  const [saveOpen, setSaveOpen] = React.useState(false)

  const setMode = (m: InsightBodyMode) => {
    setRow((r) => {
      if (m === 'structured' && !r.article) {
        return { ...r, bodyMode: m, article: defaultArticle() }
      }
      return { ...r, bodyMode: m }
    })
  }

  const toggleFilter = (id: string) => {
    setRow((r) => {
      const has = r.filterIds.includes(id)
      const filterIds = has ? r.filterIds.filter((x) => x !== id) : [...r.filterIds, id]
      return { ...r, filterIds }
    })
  }

  const saveInsight = async () => {
    if (!changed) return
    const payload = buildInsightPayload(row)
    if (!payload) return

    setSubmitError(null)
    setSubmitting(true)
    const ok = await onSubmit(payload)
    setSubmitting(false)
    if (!ok) {
      setSubmitError('Failed to save this insight. Please try again.')
      return
    }

    savedSnapshotRef.current = insightRowSnapshot(payload)
    router.push(backHref)
  }

  const leaveWithoutSaving = () => {
    router.push(backHref)
  }

  const requestLeave = () => {
    if (!changed) {
      leaveWithoutSaving()
      return
    }
    setDiscardOpen(true)
  }

  return (
    <AdminPageShell
      title={title}
      description={description}
      right={
        confirmUpdate ? (
          <Button type="button" variant="secondary" onClick={requestLeave}>
            Back
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link href={backHref}>Back</Link>
          </Button>
        )
      }
    >
      <form
        className={cn('w-full max-w-3xl space-y-6 xl:max-w-4xl', adminPanelSurfaceClass)}
        onSubmit={(e) => {
          e.preventDefault()
          if (confirmUpdate) return
          void saveInsight()
        }}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <Label className="text-white/80">URL slug</Label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => {
                slugSyncedRef.current = true
                setRow((r) => ({ ...r, slug: slugifyTitle(r.title) }))
              }}
            >
              Generate from title
            </Button>
          </div>
          <Input
            value={row.slug}
            onChange={(e) => {
              slugSyncedRef.current = false
              setRow((r) => ({ ...r, slug: e.target.value }))
            }}
            placeholder="my-insight-slug"
            className="border-white/15 bg-background/30 text-white"
            required
          />
          <p className="text-xs text-white/45">
            Public URL preview:{' '}
            <span className="text-white/75">
              {insightHref(slugifyTitle(row.slug) || 'your-slug')}
            </span>
          </p>
          {row.id.trim() ? (
            <p className="text-xs text-white/40">
              Internal id: <code className="text-white/60">{row.id}</code>
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Title</Label>
          <Input
            value={row.title}
            onChange={(e) => setRow((r) => ({ ...r, title: e.target.value }))}
            className="border-white/15 bg-background/30 text-white"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">Date (display)</Label>
            <Input
              value={row.date}
              onChange={(e) => setRow((r) => ({ ...r, date: e.target.value }))}
              className="border-white/15 bg-background/30 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Date ISO</Label>
            <Input
              value={row.dateIso}
              onChange={(e) => setRow((r) => ({ ...r, dateIso: e.target.value }))}
              placeholder="2026-03-14"
              className="border-white/15 bg-background/30 text-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Card description (listing / meta)</Label>
          <Textarea
            value={row.description}
            onChange={(e) => setRow((r) => ({ ...r, description: e.target.value }))}
            rows={3}
            className="border-white/15 bg-background/30 text-white"
          />
        </div>
        <AdminInsightHeroImageField
          context="insight"
          mediaUrl={row.heroMedia?.url ?? ''}
          mediaAlt={row.heroMedia?.alt ?? ''}
          onMediaUrl={(mediaUrl) =>
            setRow((r) => ({
              ...r,
              heroMedia: mediaUrl ? { type: 'image', url: mediaUrl, alt: r.heroMedia?.alt ?? '' } : null,
              mediaAssets: mediaUrl
                ? [{ type: 'image', url: mediaUrl, alt: r.heroMedia?.alt ?? '' }, ...r.mediaAssets.slice(1)]
                : r.mediaAssets.filter((_, i) => i > 0),
            }))
          }
          onMediaAlt={(mediaAlt) =>
            setRow((r) => ({
              ...r,
              heroMedia: r.heroMedia ? ({ ...r.heroMedia, alt: mediaAlt } as MediaAsset) : null,
              mediaAssets: r.mediaAssets.map((m, i) => (i === 0 ? { ...m, alt: mediaAlt } : m)),
            }))
          }
        />
        <div className="space-y-3">
          <Label className="text-white/80">Filters (insights index)</Label>
          <div className="flex flex-wrap gap-4">
            {filterOptions.map((f) => (
              <label key={f.id} className="flex cursor-pointer items-center gap-2 text-sm text-white/90">
                <Checkbox
                  checked={row.filterIds.includes(f.id)}
                  onCheckedChange={() => toggleFilter(f.id)}
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-6">
          <Label className="text-base text-white">Article body</Label>
          <p className="text-sm text-white/60">
            Simple = one flowing article (matches default insight pages). Structured = TOC + sidebar +
            sections (matches the biomimicry layout).
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'simple' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setMode('simple')}
            >
              Simple (rich text)
            </Button>
            <Button
              type="button"
              variant={mode === 'structured' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setMode('structured')}
            >
              Structured (TOC + sections)
            </Button>
          </div>

          {mode === 'simple' ? (
            <AdminRichTextEditor
              value={row.simpleBodyHtml ?? '<p></p>'}
              onChange={(html) => setRow((r) => ({ ...r, simpleBodyHtml: html }))}
              minHeightClass="min-h-[280px]"
            />
          ) : row.article ? (
            <AdminInsightStructuredEditor
              value={row.article}
              onChange={(article) => setRow((r) => ({ ...r, article }))}
            />
          ) : null}
        </div>

        {submitError ? <p className="text-sm text-red-300">{submitError}</p> : null}

        {confirmUpdate ? (
          <>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={requestLeave}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={!changed || submitting}
                onClick={() => setSaveOpen(true)}
              >
                {submitting ? 'Saving...' : submitLabel}
              </Button>
            </div>

            <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes. Discard them and return to the insights list, or keep editing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction onClick={leaveWithoutSaving}>Discard changes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={saveOpen} onOpenChange={setSaveOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Update this insight?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will save your changes and return to the Insights admin list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => void saveInsight()}>Update</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" asChild>
              <Link href={backHref}>Cancel</Link>
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? 'Saving...' : submitLabel}
            </Button>
          </div>
        )}
      </form>
    </AdminPageShell>
  )
}
