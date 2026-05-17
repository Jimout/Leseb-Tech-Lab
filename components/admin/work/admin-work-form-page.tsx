'use client'

import * as React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { AdminInsightHeroImageField } from '@/components/admin/insights/admin-insight-hero-image-field'
import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { AdminWorkContentBlocksEditor } from '@/components/admin/work/admin-work-content-blocks-editor'
import { AdminWorkFormDetailMetaFields } from '@/components/admin/work/admin-work-form-detail-fields'
import { emptyWork, emptyWorkDetail, type WorkRow } from '@/components/admin/work/admin-work-fields'
import {
  buildWorkPayload,
  mergeInitialDetail,
  workRowSnapshot,
} from '@/components/admin/work/admin-work-form-helpers'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buildWorkInsightFilterChecklistOptions } from '@/lib/portfolio-catalog-filters'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { adminPanelSurfaceClass } from '@/lib/admin/admin-layout-classes'
import type { WorkDetailPatch } from '@/lib/work-admin-types'
import { slugifyTitle } from '@/lib/slug-format'
import type { MediaAsset } from '@/lib/media-assets'
import { cn } from '@/lib/utils'

const accordionItemClass = 'rounded-2xl border border-white/10 bg-white/5 px-0 border-b-0'
const accordionTriggerClass =
  'px-5 py-4 text-white hover:no-underline sm:px-6 [&>svg]:text-white/50'
const accordionContentClass = 'px-5 pb-6 pt-1 sm:px-6'
const fieldClass = 'border-white/15 bg-background/30 text-white'

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-background/20 px-4 py-3 sm:px-5">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-white/55">{description}</p>
    </div>
  )
}

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/80">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-white/45">{hint}</p> : null}
    </div>
  )
}

function SectionDivider() {
  return <div className="border-t border-white/10" aria-hidden />
}

export function AdminWorkFormPage({
  title,
  description,
  backHref,
  submitLabel,
  initial,
  onSubmit,
  mode = 'create',
}: {
  title: string
  description?: string
  backHref: string
  submitLabel: string
  initial: WorkRow
  onSubmit: (value: WorkRow) => Promise<boolean> | boolean
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const { settings } = useSiteSettings()
  const filterOptions = React.useMemo(
    () => buildWorkInsightFilterChecklistOptions(settings.portfolioCatalogFilters.workInsights),
    [settings.portfolioCatalogFilters.workInsights],
  )
  const slugSyncedRef = React.useRef(!initial.id)
  const savedSnapshotRef = React.useRef(workRowSnapshot(initial))

  const [row, setRow] = React.useState<WorkRow>(() => ({
    ...emptyWork(),
    ...initial,
    slug: initial.slug || (!initial.id ? slugifyTitle(initial.title) : ''),
    cardSummary: initial.cardSummary ?? '',
    filterIds: [...initial.filterIds],
    detail: mergeInitialDetail(initial.detail),
  }))

  React.useEffect(() => {
    slugSyncedRef.current = !initial.id
    const next = {
      ...emptyWork(),
      ...initial,
      slug: initial.slug || (!initial.id ? slugifyTitle(initial.title) : ''),
      cardSummary: initial.cardSummary ?? '',
      filterIds: [...initial.filterIds],
      detail: mergeInitialDetail(initial.detail),
    }
    savedSnapshotRef.current = workRowSnapshot(next)
    setRow(next)
  }, [initial])

  React.useEffect(() => {
    if (!slugSyncedRef.current) return
    setRow((r) => ({ ...r, slug: slugifyTitle(r.title) }))
  }, [row.title])

  const d = row.detail ?? emptyWorkDetail()
  const changed = workRowSnapshot(row) !== savedSnapshotRef.current

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

  const categoryTags = React.useMemo(
    () =>
      row.category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [row.category],
  )

  const contentBlocks = d.contentBlocks ?? []
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const publicWorkPath = row.slug.trim() ? `/work/${slugifyTitle(row.slug)}` : '/work'

  const saveWork = async () => {
    const payload = buildWorkPayload(row)
    if (!payload.title.trim()) return
    setSubmitError(null)
    setSubmitting(true)
    const ok = await onSubmit(payload)
    setSubmitting(false)
    if (!ok) {
      setSubmitError('Failed to save this work item. Please try again.')
      return
    }
    savedSnapshotRef.current = workRowSnapshot(payload)
    router.push(backHref)
  }

  const resetToSaved = () => {
    const parsed = JSON.parse(savedSnapshotRef.current) as WorkRow
    slugSyncedRef.current = !parsed.id
    setRow({
      ...parsed,
      filterIds: [...parsed.filterIds],
      detail: mergeInitialDetail(parsed.detail),
    })
  }

  return (
    <AdminPageShell
      title={title}
      description={description}
      right={
        <div className="flex flex-wrap items-center gap-2">
          {row.slug.trim() ? (
            <Button
              variant="outline"
              asChild
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
            >
              <Link href={publicWorkPath} target="_blank" rel="noopener noreferrer">
                View project
                <ExternalLink className="ml-2 size-3.5 opacity-70" aria-hidden />
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="secondary">
            <Link href={backHref}>Back to list</Link>
          </Button>
        </div>
      }
    >
      <form
        className={cn('w-full max-w-5xl 2xl:max-w-6xl', adminPanelSurfaceClass)}
        onSubmit={(e) => {
          e.preventDefault()
          void saveWork()
        }}
      >
        <Accordion type="multiple" defaultValue={['card']} className="flex flex-col gap-4">
          <AccordionItem value="card" className={accordionItemClass}>
            <AccordionTrigger className={accordionTriggerClass}>
              <span className="text-left">
                <span className="block text-sm font-semibold text-white">Work card</span>
                <span className="mt-0.5 block text-xs font-normal text-white/50">Shown on /work grid</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className={cn(accordionContentClass, 'flex flex-col gap-6')}>
              <SectionIntro
                title="Work grid card"
                description="What visitors see on /work before they open this project."
              />
              <FieldGroup label="URL slug" hint={`Public URL: ${publicWorkPath}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    value={row.slug}
                    onChange={(e) => {
                      slugSyncedRef.current = false
                      setRow((r) => ({ ...r, slug: e.target.value }))
                    }}
                    placeholder="my-project-slug"
                    className={cn(fieldClass, 'min-w-0 flex-1')}
                    required
                  />
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
              </FieldGroup>

              <SectionDivider />

              <FieldGroup label="Project title">
                <Input
                  value={row.title}
                  onChange={(e) => setRow((r) => ({ ...r, title: e.target.value }))}
                  className={fieldClass}
                  required
                />
              </FieldGroup>

              <div className="grid gap-6 sm:grid-cols-2">
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
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Practice tag</Label>
                  <Input
                    value={row.category}
                    onChange={(e) => setRow((r) => ({ ...r, category: e.target.value }))}
                    placeholder="e.g. Civic Tech"
                    className={fieldClass}
                  />
                  <p className="text-xs text-white/45">Small label on the card. Comma-separated for multiple hero tags.</p>
                </div>
              </div>
              <FieldGroup label="Card tagline" hint="One sentence under the title on the work grid.">
                <Textarea
                  value={row.cardSummary ?? ''}
                  onChange={(e) => setRow((r) => ({ ...r, cardSummary: e.target.value }))}
                  rows={2}
                  placeholder="e.g. Tools that help communities organize, decide, and act together."
                  className={fieldClass}
                />
              </FieldGroup>

              {categoryTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map((tag, idx) => (
                    <span
                      key={`${tag}-${idx}`}
                      className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <SectionDivider />

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
              <SectionDivider />

              <FieldGroup label="Filters" hint="Which /work filter pills include this project.">
                <div className="flex flex-wrap gap-4 pt-1">
                  {filterOptions.map((f) => (
                    <label key={f.id} className="flex cursor-pointer items-center gap-2 text-sm text-white/90">
                      <Checkbox checked={row.filterIds.includes(f.id)} onCheckedChange={() => toggleFilter(f.id)} />
                      {f.label}
                    </label>
                  ))}
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hero" className={accordionItemClass}>
            <AccordionTrigger className={accordionTriggerClass}>
              <span className="text-left">
                <span className="block text-sm font-semibold text-white">Project hero</span>
                <span className="mt-0.5 block text-xs font-normal text-white/50">Top of /work/[slug]</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className={cn(accordionContentClass, 'flex flex-col gap-6')}>
              <SectionIntro
                title="Hero headline"
                description="Uses title, year, tags, and cover from the work card. Location appears under the headline."
              />
              <FieldGroup label="Location">
                <Input
                  value={row.location}
                  onChange={(e) => setRow((r) => ({ ...r, location: e.target.value }))}
                  placeholder="e.g. Addis Ababa, Ethiopia"
                  className={fieldClass}
                />
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="story" className={accordionItemClass}>
            <AccordionTrigger className={accordionTriggerClass}>
              <span className="text-left">
                <span className="block text-sm font-semibold text-white">Case study</span>
                <span className="mt-0.5 block text-xs font-normal text-white/50">Intro, facts, video & below-video sections</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className={cn(accordionContentClass, 'flex flex-col gap-6')}>
              <SectionIntro
                title="Case study body"
                description="Intro and facts first, then the story video. Everything under the video is built from flexible sections."
              />
              <AdminWorkFormDetailMetaFields detail={d} setDetail={setDetail} />
              <SectionDivider />
              <AdminWorkContentBlocksEditor blocks={contentBlocks} setDetail={setDetail} />
              <SectionDivider />
              <FieldGroup
                label="Project website (sticky bar)"
                hint="Optional fixed “Visit website” bar at the bottom of the page. You can also add an inline link button in a section above."
              >
                <Input
                  value={d.websiteUrl ?? ''}
                  onChange={(e) => setDetail({ websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className={fieldClass}
                  inputMode="url"
                  autoComplete="url"
                />
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
          aria-label="Save actions"
        >
          <p className="text-sm font-medium text-white">Save changes</p>
          <p className="mt-1 text-sm text-white/50">
            {mode === 'create'
              ? 'Creates this project on /work and its project page.'
              : 'Updates the work card and project page for all visitors.'}
          </p>
          {submitError ? <p className="mt-2 text-sm text-red-300">{submitError}</p> : null}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {mode === 'edit' ? (
              <AdminPageSaveCancelActions
                changed={changed}
                pageName="Work"
                publicPath={publicWorkPath}
                saveTitle="Save work?"
                saveDescription="This will update the work card on /work and the project page for all visitors."
                onSave={() => void saveWork()}
                onDiscard={resetToSaved}
              />
            ) : (
              <>
                <Button type="button" variant="secondary" className="w-full sm:w-auto" asChild>
                  <Link href={backHref}>Cancel</Link>
                </Button>
                <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? 'Saving...' : submitLabel}
                </Button>
              </>
            )}
          </div>
        </section>
      </form>
    </AdminPageShell>
  )
}
