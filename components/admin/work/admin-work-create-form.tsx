'use client'

import * as React from 'react'

import { AdminInsightHeroImageField } from '@/components/admin/insights/admin-insight-hero-image-field'
import { AdminWorkContentBlocksEditor } from '@/components/admin/work/admin-work-content-blocks-editor'
import { AdminWorkFormDetailMetaFields } from '@/components/admin/work/admin-work-form-detail-fields'
import { emptyWorkDetail } from '@/components/admin/work/admin-work-fields'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { adminPanelSurfaceClass } from '@/lib/admin/admin-layout-classes'
import {
  buildWorkRowFromCreateForm,
  emptyWorkCreateFormSnapshot,
  isWorkCreateFormDirty,
  workCreateFormSnapshot,
} from '@/lib/admin/work-create-form-validation'
import { buildWorkInsightFilterChecklistOptions } from '@/lib/portfolio-catalog-filters'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { slugifyTitle } from '@/lib/slug-format'
import { cn } from '@/lib/utils'
import type { WorkDetailPatch, WorkRow } from '@/lib/work-admin-types'

const inputClass = 'border-white/15 bg-background/30 text-white placeholder:text-white/35'
const labelClass = 'text-sm font-medium text-white/85'

const adminDialogClass = 'border-white/10 bg-[#141414] text-white'

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description ? <p className="mt-1 text-sm text-white/55">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

type AdminWorkCreateFormProps = {
  onCreated?: (row: WorkRow) => void
  onDirtyChange?: (dirty: boolean) => void
  onSubmit: (row: WorkRow) => Promise<boolean>
  className?: string
}

export function AdminWorkCreateForm({
  onCreated,
  onDirtyChange,
  onSubmit,
  className,
}: AdminWorkCreateFormProps) {
  const { toast } = useToast()
  const { settings } = useSiteSettings()
  const filterOptions = React.useMemo(
    () => buildWorkInsightFilterChecklistOptions(settings.portfolioCatalogFilters.workInsights),
    [settings.portfolioCatalogFilters.workInsights],
  )

  const [slug, setSlug] = React.useState('')
  const [title, setTitle] = React.useState('')
  const slugSyncedRef = React.useRef(true)
  const [year, setYear] = React.useState(() => String(new Date().getFullYear()))
  const [category, setCategory] = React.useState('')
  const [cardSummary, setCardSummary] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [heroUrl, setHeroUrl] = React.useState('')
  const [heroAlt, setHeroAlt] = React.useState('')
  const [filterIds, setFilterIds] = React.useState<string[]>([])
  const [detail, setDetailState] = React.useState<WorkDetailPatch>(() => emptyWorkDetail())
  const [submitting, setSubmitting] = React.useState(false)
  const [heroUploading, setHeroUploading] = React.useState(false)

  const setDetail = React.useCallback((patch: Partial<WorkDetailPatch>) => {
    setDetailState((prev) => ({ ...emptyWorkDetail(), ...prev, ...patch }))
  }, [])

  const contentBlocks = detail.contentBlocks ?? []

  React.useEffect(() => {
    if (!slugSyncedRef.current) return
    setSlug(slugifyTitle(title))
  }, [title])

  const publicWorkPath = slug.trim() ? `/work/${slugifyTitle(slug)}` : '/work'

  const formSnapshot = React.useMemo(
    () =>
      workCreateFormSnapshot({
        slug,
        title,
        year,
        category,
        cardSummary,
        location,
        heroUrl,
        heroAlt,
        filterIds,
        pageTitle: detail.pageTitle ?? '',
        descriptionNote: detail.descriptionNote ?? '',
        client: detail.client ?? '',
        industry: detail.industry ?? '',
        duration: detail.duration ?? '',
        contentBlocks,
      }),
    [
      slug,
      title,
      year,
      category,
      cardSummary,
      location,
      heroUrl,
      heroAlt,
      filterIds,
      detail.pageTitle,
      detail.descriptionNote,
      detail.client,
      detail.industry,
      detail.duration,
      contentBlocks,
    ],
  )

  const dirty = React.useMemo(() => isWorkCreateFormDirty(formSnapshot), [formSnapshot])

  React.useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  const resetForm = React.useCallback(() => {
    const empty = emptyWorkCreateFormSnapshot()
    setTitle(empty.title)
    setYear(empty.year)
    setCategory(empty.category)
    setCardSummary(empty.cardSummary)
    setLocation(empty.location)
    setHeroUrl(empty.heroUrl)
    setHeroAlt(empty.heroAlt)
    setFilterIds([])
    setDetailState(emptyWorkDetail())
  }, [])

  const toggleFilter = (id: string) => {
    setFilterIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (heroUploading) {
      toast({
        title: 'Image still uploading',
        description: 'Wait for the cover image upload to finish.',
        variant: 'destructive',
      })
      return
    }

    const payload = buildWorkRowFromCreateForm(formSnapshot)
    setSubmitting(true)
    try {
      const ok = await onSubmit(payload)
      if (!ok) return
      toast({ title: 'Work published', description: payload.title })
      onCreated?.(payload)
      resetForm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(adminPanelSurfaceClass, 'space-y-6', className)}
    >
      <FormSection
        title="Work card"
        description="What visitors see on /work and the hero on the project page."
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <Label htmlFor="work-slug" className={labelClass}>
              URL slug
            </Label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => {
                slugSyncedRef.current = true
                setSlug(slugifyTitle(title))
              }}
            >
              Generate from title
            </Button>
          </div>
          <Input
            id="work-slug"
            value={slug}
            onChange={(e) => {
              slugSyncedRef.current = false
              setSlug(e.target.value)
            }}
            placeholder="my-project-slug"
            className={inputClass}
          />
          <p className="text-xs text-white/45">
            Public URL: <span className="text-white/70">{publicWorkPath}</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="work-title" className={labelClass}>
            Title
          </Label>
          <Input
            id="work-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project name"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="work-year" className={labelClass}>
              Year
            </Label>
            <Input
              id="work-year"
              value={year}
              type="text"
              inputMode="numeric"
              maxLength={4}
              onChange={(e) => setYear(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="2026"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="work-category" className={labelClass}>
              Practice tag
            </Label>
            <Input
              id="work-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Civic Tech"
              className={inputClass}
            />
            <p className="text-xs text-white/45">Small label on the work card.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="work-tagline" className={labelClass}>
            Card tagline
          </Label>
          <Textarea
            id="work-tagline"
            value={cardSummary}
            onChange={(e) => setCardSummary(e.target.value)}
            rows={3}
            placeholder="One sentence under the title on the work grid"
            className={inputClass}
          />
        </div>

        <AdminInsightHeroImageField
          context="work"
          mediaUrl={heroUrl}
          mediaAlt={heroAlt}
          onMediaUrl={setHeroUrl}
          onMediaAlt={setHeroAlt}
          onUploadingChange={setHeroUploading}
          onError={(message) =>
            toast({ title: 'Upload failed', description: message, variant: 'destructive' })
          }
        />

        <div className="space-y-2">
          <Label htmlFor="work-location" className={labelClass}>
            Location
          </Label>
          <Input
            id="work-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Addis Ababa, Ethiopia"
            className={inputClass}
          />
          <p className="text-xs text-white/45">Shown under the headline on the project page.</p>
        </div>

        <div className="space-y-3">
          <Label className={labelClass}>Filters</Label>
          <p className="text-xs text-white/45">Which /work filter pills include this project.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {filterOptions.map((f) => (
              <label key={f.id} className="flex cursor-pointer items-center gap-2 text-sm text-white/90">
                <Checkbox
                  checked={filterIds.includes(f.id)}
                  onCheckedChange={() => toggleFilter(f.id)}
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Case study intro"
        description="Main project detail at the top of the page — intro copy and facts, same structure as the live project page."
      >
        <AdminWorkFormDetailMetaFields
          detail={detail}
          setDetail={setDetail}
          labelClassName={labelClass}
          fieldClassName={inputClass}
        />
      </FormSection>

      <FormSection
        title="Page sections"
        description="Use the add buttons first — each text, gallery, or link section appears right below them. Reorder with the arrows on each section."
      >
        <AdminWorkContentBlocksEditor
          blocks={contentBlocks}
          setDetail={setDetail}
          embedded
        />
      </FormSection>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={submitting || heroUploading}
          className="sm:min-w-[10rem]"
        >
          {submitting ? 'Publishing…' : heroUploading ? 'Uploading cover…' : 'Publish work'}
        </Button>
        {dirty ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="secondary" disabled={submitting}>
                Clear form
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={adminDialogClass}>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear the form?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/65">
                  All fields will be reset. Stay to keep your draft, or clear to start over.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Stay
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-white/15 text-white hover:bg-white/20"
                  onClick={resetForm}
                >
                  Clear form
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button type="button" variant="secondary" disabled={submitting || !dirty} onClick={resetForm}>
            Clear form
          </Button>
        )}
      </div>
    </form>
  )
}
