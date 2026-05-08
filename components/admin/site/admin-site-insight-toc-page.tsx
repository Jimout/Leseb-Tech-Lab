'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { SiteInsightTocSettings } from '@/lib/admin/site-settings'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

export function AdminSiteInsightTocPage() {
  const { settings, patch } = useSiteSettings()
  const [draft, setDraft] = useState<SiteInsightTocSettings>(settings.insightToc)

  useEffect(() => setDraft(settings.insightToc), [settings.insightToc])

  const changed = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(settings.insightToc),
    [draft, settings.insightToc],
  )

  return (
    <AdminPageShell
      title="Insight TOC mark"
      description="Logo images next to “Contents” on structured insight pages (table of contents). Dark mode uses the first image; light mode uses the second."
      right={
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" disabled={!changed}>
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will revert the TOC mark settings to the last saved values.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction onClick={() => setDraft(settings.insightToc)}>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!changed}>Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save TOC mark?</AlertDialogTitle>
                <AlertDialogDescription>
                  Updates the images shown on structured insight pages across the site.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => patch({ insightToc: draft })}>Save</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
    >
      <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ImageUploadField
            label="Dark mode image"
            value={draft.markDarkSrc}
            onChange={(next) => setDraft((p) => ({ ...p, markDarkSrc: next }))}
            aspectClassName="aspect-square"
          />
          <ImageUploadField
            label="Light mode image"
            value={draft.markLightSrc}
            onChange={(next) => setDraft((p) => ({ ...p, markLightSrc: next }))}
            aspectClassName="aspect-square"
          />
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-white/85">Image alt text (optional)</p>
          <Input
            value={draft.markAlt}
            onChange={(e) => setDraft((p) => ({ ...p, markAlt: e.target.value }))}
            placeholder="Describe the logo for screen readers"
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </div>
      </Card>
    </AdminPageShell>
  )
}
