'use client'

/** Publish form for /leseb-admin/insights/create */
import * as React from 'react'
import { createId } from '@paralleldrive/cuid2'

import { AdminRichTextEditor } from '@/components/admin/admin-rich-text-editor'
import { AdminInsightHeroImageField } from '@/components/admin/insights/admin-insight-hero-image-field'
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
import { AdminInsightDateFields } from '@/components/admin/insights/admin-insight-date-fields'
import { defaultInsightDates, formatInsightDisplayDate, buildInsightDateIso, parseInsightDateIso } from '@/lib/admin/insight-form-dates'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'
import { adminPanelSurfaceClass } from '@/lib/admin/admin-layout-classes'
import {
  insightCreateFormSnapshot,
  isInsightCreateFormDirty,
  validateInsightCreateForm,
} from '@/lib/admin/insight-create-form-dirty'
import { buildWorkInsightFilterChecklistOptions } from '@/lib/portfolio-catalog-filters'
import { isInsightHtmlEmpty } from '@/lib/sanitize-insight-html'
import { createNotificationEventClient } from '@/lib/notifications/client'
import { insightHref } from '@/lib/insights-showcase-data'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { slugifyTitle } from '@/lib/slug-format'
import { cn } from '@/lib/utils'
import type { MediaAsset } from '@/lib/media-assets'

const inputClass = 'border-white/15 bg-background/30 text-white placeholder:text-white/35'
const labelClass = 'text-sm font-medium text-white/85'

const adminDialogClass = 'border-white/10 bg-[#141414] text-white'

type AdminInsightCreateFormProps = {
  onCreated?: (insight: ShowcaseInsight) => void
  onDirtyChange?: (dirty: boolean) => void
  className?: string
}

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

export function AdminInsightCreateForm({ onCreated, onDirtyChange, className }: AdminInsightCreateFormProps) {
  const { toast } = useToast()
  const { settings } = useSiteSettings()
  const filterOptions = React.useMemo(
    () => buildWorkInsightFilterChecklistOptions(settings.portfolioCatalogFilters.workInsights),
    [settings.portfolioCatalogFilters.workInsights],
  )

  const defaults = React.useMemo(() => defaultInsightDates(), [])

  const [title, setTitle] = React.useState('')
  const [dateIso, setDateIso] = React.useState(defaults.dateIso)
  const [description, setDescription] = React.useState('')
  const [heroUrl, setHeroUrl] = React.useState('')
  const [heroAlt, setHeroAlt] = React.useState('')
  const [filterIds, setFilterIds] = React.useState<string[]>([])
  const [bodyHtml, setBodyHtml] = React.useState('<p></p>')
  const [submitting, setSubmitting] = React.useState(false)
  const [heroUploading, setHeroUploading] = React.useState(false)

  const slugPreview = slugifyTitle(title) || 'your-insight'

  const formSnapshot = React.useMemo(
    () =>
      insightCreateFormSnapshot({
        title,
        dateIso,
        description,
        heroUrl,
        heroAlt,
        filterIds,
        bodyHtml,
      }),
    [title, dateIso, description, heroUrl, heroAlt, filterIds, bodyHtml],
  )

  const validation = React.useMemo(() => validateInsightCreateForm(formSnapshot), [formSnapshot])

  const dirty = React.useMemo(() => isInsightCreateFormDirty(formSnapshot), [formSnapshot])

  React.useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  const resetForm = React.useCallback(() => {
    const nextDates = defaultInsightDates()
    setTitle('')
    setDateIso(nextDates.dateIso)
    setDescription('')
    setHeroUrl('')
    setHeroAlt('')
    setFilterIds([])
    setBodyHtml('<p></p>')
  }, [])

  const toggleFilter = (id: string) => {
    setFilterIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validation.valid) {
      toast({
        title: 'Complete all required fields',
        description: validation.missing.join(' · '),
        variant: 'destructive',
      })
      return
    }

    if (heroUploading) {
      toast({
        title: 'Image still uploading',
        description: 'Wait for the hero image upload to finish.',
        variant: 'destructive',
      })
      return
    }

    const trimmedTitle = title.trim()
    const slug = slugifyTitle(trimmedTitle)
    const heroMedia: MediaAsset | null = heroUrl.trim()
      ? { type: 'image', url: heroUrl.trim(), alt: heroAlt.trim() || trimmedTitle }
      : null

    const normalizedDateIso = buildInsightDateIso(parseInsightDateIso(dateIso))

    const payload: ShowcaseInsight = {
      id: createId(),
      publicId: '',
      slug,
      href: insightHref(slug),
      date: formatInsightDisplayDate(new Date(`${normalizedDateIso}T12:00:00`)),
      dateIso: normalizedDateIso,
      title: trimmedTitle,
      description: description.trim(),
      heroMedia,
      mediaAssets: heroMedia ? [heroMedia] : [],
      filterIds,
      bodyMode: 'simple',
      simpleBodyHtml: bodyHtml,
    }

    const sessionHeader = getSessionHeaderFromStorage()
    if (!sessionHeader) {
      toast({
        title: 'Session expired',
        description: 'Sign in again to publish.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session': sessionHeader,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        toast({
          title: 'Could not publish',
          description: data?.error ?? 'Check your connection and try again.',
          variant: 'destructive',
        })
        return
      }

      const data = (await res.json()) as { insight?: ShowcaseInsight }
      const created = data.insight ?? payload

      void createNotificationEventClient({
        type: 'INSIGHT_PUBLISHED',
        title: `New insight: ${created.title}`,
        summary: created.description || undefined,
        url: `/insights/${encodeURIComponent(created.slug)}`,
        entityId: created.id,
      })

      toast({ title: 'Insight published', description: created.title })
      onCreated?.(created)
      resetForm()
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Try again in a moment.',
        variant: 'destructive',
      })
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
        title="Hero"
        description="Title, date, summary, and cover image shown at the top of the article."
      >
        <div className="space-y-2">
          <Label htmlFor="insight-title" className={labelClass}>
            Title *
          </Label>
          <Input
            id="insight-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Insight headline"
            className={inputClass}
            required
          />
          <p className="text-xs text-white/45">
            URL: <span className="text-white/70">{insightHref(slugPreview)}</span>
          </p>
        </div>

        <AdminInsightDateFields
          dateIso={dateIso}
          onDateIsoChange={setDateIso}
          labelClassName={labelClass}
        />

        <div className="space-y-2">
          <Label htmlFor="insight-summary" className={labelClass}>
            Summary *
          </Label>
          <Textarea
            id="insight-summary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Short intro on the hero and insight cards"
            className={inputClass}
            required
          />
        </div>

        <AdminInsightHeroImageField
          context="insight"
          required
          mediaUrl={heroUrl}
          mediaAlt={heroAlt}
          onMediaUrl={setHeroUrl}
          onMediaAlt={setHeroAlt}
          onUploadingChange={setHeroUploading}
          onError={(message) =>
            toast({ title: 'Upload failed', description: message, variant: 'destructive' })
          }
        />

        <div className="space-y-3">
          <Label className={labelClass}>Topics *</Label>
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

      <FormSection title="Article *" description="Main story content below the hero.">
        <AdminRichTextEditor
          value={bodyHtml}
          onChange={setBodyHtml}
          minHeightClass="min-h-[220px]"
        />
      </FormSection>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
        {!validation.valid ? (
          <p className="w-full text-xs text-white/50 sm:order-last sm:basis-full">
            Required: {validation.missing.join(', ')}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={submitting || heroUploading || !validation.valid}
          className="sm:min-w-[10rem]"
        >
          {submitting ? 'Publishing…' : heroUploading ? 'Uploading image…' : 'Publish insight'}
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
