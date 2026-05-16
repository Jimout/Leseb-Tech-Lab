'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AdminInsightHeroImageField } from '@/components/admin/insights/admin-insight-hero-image-field'
import { AdminWorkContentBlocksEditor } from '@/components/admin/work/admin-work-content-blocks-editor'
import { AdminWorkFormDetailMetaFields } from '@/components/admin/work/admin-work-form-detail-fields'
import { normalizeFourParagraphs } from '@/components/admin/work/admin-work-secondary-description-fields'
import { emptyWorkDetail, emptyWork, type WorkRow } from '@/components/admin/work/admin-work-fields'
import {
  deriveBlocksFromLegacy,
  normalizeWorkDetailContentBlocks,
} from '@/lib/work-detail-content-blocks'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { buildWorkInsightFilterChecklistOptions } from '@/lib/portfolio-catalog-filters'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { adminPanelSurfaceClass } from '@/lib/admin/admin-layout-classes'
import type { WorkDetailPatch } from '@/lib/work-admin-types'
import { slugifyTitle } from '@/lib/slug-format'
import { cn } from '@/lib/utils'
import type { MediaAsset } from '@/lib/media-assets'

function mergeInitialDetail(d?: WorkDetailPatch): WorkDetailPatch {
  const e = emptyWorkDetail()
  if (!d) return { ...e, contentBlocks: deriveBlocksFromLegacy(e) }
  if (d.contentBlocks?.length) {
    return {
      ...e,
      ...d,
      tags: d.tags,
      roles: d.roles,
      additionalImages: d.additionalImages,
      descriptionBelowImages: d.descriptionBelowImages,
      secondaryImageDescriptionColumns: normalizeFourParagraphs(d.secondaryImageDescriptionColumns),
      contentBlocks: d.contentBlocks,
    }
  }
  if (Array.isArray(d.contentBlocks)) {
    return {
      ...e,
      ...d,
      tags: d.tags,
      roles: d.roles,
      additionalImages: d.additionalImages,
      descriptionBelowImages: d.descriptionBelowImages,
      secondaryImageDescriptionColumns: normalizeFourParagraphs(d.secondaryImageDescriptionColumns),
      contentBlocks: d.contentBlocks,
    }
  }
  const derived = deriveBlocksFromLegacy(d)
  return {
    ...e,
    ...d,
    tags: d.tags,
    roles: d.roles,
    additionalImages: [],
    descriptionBelowImages: [],
    secondaryImageDescriptionColumns: normalizeFourParagraphs([]),
    secondaryHeroImage: d.secondaryHeroImage === null ? null : undefined,
    contentBlocks: derived,
  }
}

function normalizeDetailForSave(
  d: WorkDetailPatch,
  secondary: { remove: boolean; src: string; alt: string; publicId?: string },
): WorkDetailPatch {
  const contentBlocks = normalizeWorkDetailContentBlocks(d.contentBlocks)
  if (contentBlocks.length > 0) {
    return {
      ...d,
      contentBlocks,
      additionalImages: [],
      descriptionBelowImages: [],
      secondaryImageDescriptionColumns: [],
      secondaryHeroImage: null,
    }
  }

  const additionalImages = (d.additionalImages ?? []).filter((x) => x.src.trim())
  const descriptionBelowImages = (d.descriptionBelowImages ?? []).filter((x) => x.src.trim())
  const secondaryImageDescriptionColumns = (d.secondaryImageDescriptionColumns ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
  let secondaryHeroImage: WorkDetailPatch['secondaryHeroImage']
  if (secondary.remove) secondaryHeroImage = null
  else if (secondary.src.trim())
    secondaryHeroImage = {
      src: secondary.src.trim(),
      alt: secondary.alt.trim(),
      publicId: secondary.publicId?.trim() || undefined,
    }
  return {
    ...d,
    additionalImages,
    descriptionBelowImages,
    secondaryImageDescriptionColumns,
    secondaryHeroImage,
    contentBlocks: undefined,
  }
}

/** Drop empty values so merge keeps server defaults; omit `{}` entirely. */
function compactDetailForStorage(d: WorkDetailPatch): WorkDetailPatch | undefined {
  const out: WorkDetailPatch = { ...d }
  const strKeys = ['projectType', 'descriptionNote'] as const
  for (const k of strKeys) {
    const v = out[k]
    if (typeof v === 'string' && !v.trim()) delete out[k]
  }
  /** Hero identity (title, tags, year, lines) comes only from the card row — never persist duplicate overrides. */
  delete out.year
  delete out.tags
  delete out.pageTitle
  delete out.pageTitleLine1
  delete out.pageTitleLine2
  delete out.body
  if (!out.roles?.length) delete out.roles
  if (!out.additionalImages?.length) delete out.additionalImages
  if (!out.descriptionBelowImages?.length) delete out.descriptionBelowImages
  if (!out.secondaryImageDescriptionColumns?.length) delete out.secondaryImageDescriptionColumns
  if (!out.contentBlocks?.length) delete out.contentBlocks
  if (out.secondaryHeroImage === undefined) delete out.secondaryHeroImage
  if (Object.keys(out).length === 0) return undefined
  return out
}

function buildWorkPayload(
  row: WorkRow,
  secondary: { remove: boolean; src: string; alt: string; publicId?: string },
): WorkRow {
  const id = String(row.id || '').trim()
  const slug = String(row.slug || '').trim()
  const detail = compactDetailForStorage(normalizeDetailForSave(row.detail ?? emptyWorkDetail(), secondary))
  return {
    id,
    publicId: row.publicId,
    slug,
    heroMedia: row.heroMedia,
    mediaAssets: row.mediaAssets,
    year: row.year,
    location: row.location,
    title: row.title,
    category: row.category,
    filterIds: [...row.filterIds],
    detail,
  }
}

export function AdminWorkFormPage({
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
  initial: WorkRow
  onSubmit: (value: WorkRow) => Promise<boolean> | boolean
  confirmUpdate?: boolean
}) {
  const router = useRouter()
  const { settings } = useSiteSettings()
  const filterOptions = React.useMemo(
    () => buildWorkInsightFilterChecklistOptions(settings.portfolioCatalogFilters.workInsights),
    [settings.portfolioCatalogFilters.workInsights],
  )
  const slugSyncedRef = React.useRef(!initial.id)

  const [row, setRow] = React.useState<WorkRow>(() => ({
    ...emptyWork(),
    ...initial,
    slug: initial.slug || (!initial.id ? slugifyTitle(initial.title) : ''),
    filterIds: [...initial.filterIds],
    detail: mergeInitialDetail(initial.detail),
  }))

  const [removeSecondary, setRemoveSecondary] = React.useState(
    () => initial.detail?.secondaryHeroImage === null,
  )
  const [secondary, setSecondary] = React.useState(() => {
    const sh = initial.detail?.secondaryHeroImage
    if (!sh || sh === null) return { src: '', alt: '', publicId: undefined }
    return { src: sh.src, alt: sh.alt, publicId: sh.publicId }
  })

  React.useEffect(() => {
    slugSyncedRef.current = !initial.id
    setRow({
      ...emptyWork(),
      ...initial,
      slug: initial.slug || (!initial.id ? slugifyTitle(initial.title) : ''),
      filterIds: [...initial.filterIds],
      detail: mergeInitialDetail(initial.detail),
    })
    setRemoveSecondary(initial.detail?.secondaryHeroImage === null)
    const sh = initial.detail?.secondaryHeroImage
    if (!sh || sh === null) setSecondary({ src: '', alt: '', publicId: undefined })
    else setSecondary({ src: sh.src, alt: sh.alt, publicId: sh.publicId })
  }, [initial])

  React.useEffect(() => {
    const patch = initial.detail
    if (!patch) return
    if (Array.isArray(patch.contentBlocks)) return
    if (deriveBlocksFromLegacy(patch).length === 0) return
    setRemoveSecondary(true)
    setSecondary({ src: '', alt: '', publicId: undefined })
  }, [initial.detail])

  React.useEffect(() => {
    if (!slugSyncedRef.current) return
    setRow((r) => ({ ...r, slug: slugifyTitle(r.title) }))
  }, [row.title])

  const d = row.detail ?? emptyWorkDetail()

  const setDetail = (patch: Partial<WorkDetailPatch>) => {
    setRow((r) => ({ ...r, detail: { ...(r.detail ?? emptyWorkDetail()), ...patch } }))
  }

  const toggleFilter = (id: string) => {
    setRow((r) => {
      const has = r.filterIds.includes(id)
      const filterIds = has ? r.filterIds.filter((x) => x !== id) : [...r.filterIds, id]
      return { ...r, filterIds }
    })
  }

  const rolesInput = (d.roles ?? []).join(', ')
  const contentBlocks = d.contentBlocks ?? []
  const categoryTags = React.useMemo(
    () =>
      row.category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [row.category],
  )

  const tabsListClass =
    'inline-flex h-auto min-h-[2.75rem] w-full flex-col gap-1 rounded-xl border border-white/10 bg-background/30 p-1 sm:flex-row sm:gap-1'
  const tabsTriggerClass =
    'flex-1 justify-center rounded-lg border border-transparent px-3 py-2.5 text-left text-sm font-medium text-white/70 transition-colors hover:text-white data-[state=active]:border-white/15 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none sm:text-center'
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const saveWork = async () => {
    const payload = buildWorkPayload(row, {
      remove: removeSecondary,
      src: secondary.src,
      alt: secondary.alt,
    })
    if (!payload.title.trim()) return
    setSubmitError(null)
    setSubmitting(true)
    const ok = await onSubmit(payload)
    setSubmitting(false)
    if (!ok) {
      setSubmitError('Failed to save this work item. Please try again.')
      return
    }
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
        className={cn('w-full max-w-5xl space-y-6 2xl:max-w-6xl', adminPanelSurfaceClass)}
        onSubmit={(e) => {
          e.preventDefault()
          if (confirmUpdate) return
          void saveWork()
        }}
      >
        <Tabs defaultValue="project" className="w-full gap-4">
          <TabsList className={tabsListClass}>
            <TabsTrigger value="project" className={tabsTriggerClass}>
              1 · Project
            </TabsTrigger>
            <TabsTrigger value="body" className={tabsTriggerClass}>
              2 · Body blocks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="mt-0 space-y-8 pt-1 focus-visible:outline-none">
            <div className="rounded-lg border border-white/10 bg-background/20 px-4 py-3 sm:px-5">
              <p className="text-sm font-medium text-white">Listing and hero</p>
              <p className="mt-1 text-sm text-white/55">
                One set of fields powers the work grid card and the project page hero: title, year, image, location,
                and category. You do not need to repeat them elsewhere.
              </p>
            </div>
            <div className="space-y-6">
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
                  placeholder="my-project-slug"
                  className="border-white/15 bg-background/30 text-white"
                  required
                />
                <p className="text-xs text-white/45">
                  Public URL preview:{' '}
                  <span className="text-white/75">/work/{slugifyTitle(row.slug) || 'your-slug'}</span>
                </p>
                {row.id.trim() ? (
                  <p className="text-xs text-white/40">
                    Internal id (never in URLs): <code className="text-white/60">{row.id}</code>
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Project title</Label>
                <Input
                  value={row.title}
                  onChange={(e) => setRow((r) => ({ ...r, title: e.target.value }))}
                  className="border-white/15 bg-background/30 text-white"
                  required
                />
                <p className="text-xs text-white/45">Same text for the grid card and the project page hero headline.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white/80">Year</Label>
                  <Input
                    value={row.year}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    onChange={(e) =>
                      setRow((r) => ({ ...r, year: e.target.value.replace(/[^0-9]/g, '') }))
                    }
                    className="border-white/15 bg-background/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Location</Label>
                  <Input
                    value={row.location}
                    onChange={(e) => setRow((r) => ({ ...r, location: e.target.value }))}
                    className="border-white/15 bg-background/30 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Category (card subtitle)</Label>
                <Input
                  value={row.category}
                  onChange={(e) => setRow((r) => ({ ...r, category: e.target.value }))}
                  placeholder="e.g. Residential, Visualization"
                  className="border-white/15 bg-background/30 text-white"
                />
                <p className="text-xs text-white/45">
                  Add categories separated by commas (example: Residential, Visualization).
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {categoryTags.length ? (
                    categoryTags.map((tag, idx) => (
                      <span
                        key={`${tag}-${idx}`}
                        className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/90"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-white/45">No categories added yet.</span>
                  )}
                </div>
              </div>
              <AdminInsightHeroImageField
                context="work"
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
                <Label className="text-white/80">Filters (work index)</Label>
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
            </div>

            <div className="h-px w-full bg-white/10" aria-hidden />

            <AdminWorkFormDetailMetaFields detail={d} setDetail={setDetail} rolesInput={rolesInput} />
          </TabsContent>

          <TabsContent value="body" className="mt-0 space-y-6 pt-1 focus-visible:outline-none">
            <div className="rounded-lg border border-white/10 bg-background/20 px-4 py-3 sm:px-5">
              <p className="text-sm font-medium text-white">Below the meta bar</p>
              <p className="mt-1 text-sm text-white/55">
                Stack paragraphs and images in order. Title, hero, tags, year, and location are set under Project.
              </p>
            </div>
            <AdminWorkContentBlocksEditor blocks={contentBlocks} setDetail={setDetail} />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/50">Saves to the backend and updates the live site.</p>
            {submitError ? <p className="text-sm text-red-300">{submitError}</p> : null}
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
                      Unsaved work changes will be lost. You can reopen this item anytime.
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
                  <Button type="button" className="w-full sm:w-auto" disabled={submitting}>
                    {submitLabel}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Update this work item?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will save your changes and return to the Work admin list.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void saveWork()} disabled={submitting}>
                      {submitting ? 'Saving...' : 'Update'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
        </div>
      </form>
    </AdminPageShell>
  )
}
