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
  AlertDialogTrigger,
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
  onSubmit: (value: InsightRow) => void
  confirmUpdate?: boolean
}) {
  const router = useRouter()
  const { settings } = useSiteSettings()
  const filterOptions = React.useMemo(
    () => buildWorkInsightFilterChecklistOptions(settings.portfolioCatalogFilters.workInsights),
    [settings.portfolioCatalogFilters.workInsights],
  )
  const slugSyncedRef = React.useRef(!initial.id)

  const [row, setRow] = React.useState<InsightRow>(() => ({
    ...emptyInsight(),
    ...initial,
    slug: initial.slug || (!initial.id ? slugifyTitle(initial.title) : ''),
    filterIds: [...initial.filterIds],
    bodyMode: initial.bodyMode ?? (initial.article ? 'structured' : 'simple'),
    simpleBodyHtml: initial.simpleBodyHtml ?? '<p></p>',
    article: initial.article ?? undefined,
  }))

  React.useEffect(() => {
    slugSyncedRef.current = !initial.id
    setRow({
      ...emptyInsight(),
      ...initial,
      slug: initial.slug || (!initial.id ? slugifyTitle(initial.title) : ''),
      filterIds: [...initial.filterIds],
      bodyMode: initial.bodyMode ?? (initial.article ? 'structured' : 'simple'),
      simpleBodyHtml: initial.simpleBodyHtml ?? '<p></p>',
      article: initial.article,
    })
  }, [initial])

  React.useEffect(() => {
    if (!slugSyncedRef.current) return
    setRow((r) => ({ ...r, slug: slugifyTitle(r.title) }))
  }, [row.title])

  const mode: InsightBodyMode = row.bodyMode ?? 'simple'

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
  const saveInsight = () => {
    if (!String(row.title || '').trim()) return
    const id = String(row.id || '').trim()
    const slug = slugifyTitle(String(row.slug || '').trim() || row.title)
    const base: InsightRow = {
      id,
      publicId: row.publicId,
      slug,
      href: insightHref(slug),
      date: row.date,
      dateIso: row.dateIso,
      title: row.title,
      description: row.description,
      heroMedia: row.heroMedia,
      mediaAssets: row.mediaAssets,
      filterIds: row.filterIds,
      bodyMode: mode,
    }
    const payload: InsightRow =
      mode === 'structured'
        ? {
            ...base,
            article: row.article ?? defaultArticle(),
          }
        : isInsightHtmlEmpty(row.simpleBodyHtml)
          ? { ...base }
          : {
              ...base,
              simpleBodyHtml: row.simpleBodyHtml ?? '<p></p>',
            }
    onSubmit(payload)
    router.push(backHref)
  }

  return (
    <AdminPageShell
      title={title}
      description={description}
      right={
        <Button asChild variant="secondary">
          <Link href={backHref}>Back</Link>
        </Button>
      }
    >
      <form
        className={cn('w-full max-w-3xl space-y-6 xl:max-w-4xl', adminPanelSurfaceClass)}
        onSubmit={(e) => {
          e.preventDefault()
          if (confirmUpdate) return
          saveInsight()
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

        {confirmUpdate ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel editing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Unsaved insight changes will be lost. You can return and edit this insight anytime.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => router.push(backHref)}>Discard changes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="w-full sm:w-auto">
                  {submitLabel}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Update this insight?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will save your changes and return to the Insights admin list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={saveInsight}>Update</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" asChild>
              <Link href={backHref}>Cancel</Link>
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {submitLabel}
            </Button>
          </div>
        )}
      </form>
    </AdminPageShell>
  )
}
