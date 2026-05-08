'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { SimpleForm, type Field } from '@/components/admin/simple-form'
import { useSiteSettings } from '@/hooks/use-site-settings'
import type { SiteDualMarqueeSettings } from '@/lib/admin/site-settings'
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

function useMarqueeFields(): readonly Field[] {
  return useMemo(
    () => [
      { key: 'label', label: 'Marquee label', kind: 'text' },
      { key: 'durationSec', label: 'Duration (seconds)', kind: 'text' },
    ],
    [],
  )
}

export function AdminSiteDualMarqueePage() {
  const { settings, patch } = useSiteSettings()
  const marqueeFields = useMarqueeFields()
  const [draft, setDraft] = useState<SiteDualMarqueeSettings>(settings.dualMarquee)

  useEffect(() => setDraft(settings.dualMarquee), [settings.dualMarquee])

  const changed = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(settings.dualMarquee),
    [draft, settings.dualMarquee],
  )

  return (
    <AdminPageShell
      title="Dual marquee"
      description="Edit the dual scrolling marquee CTA."
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
                <AlertDialogDescription>This will revert the marquee fields to the last saved values.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction onClick={() => setDraft(settings.dualMarquee)}>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!changed}>Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save dual marquee?</AlertDialogTitle>
                <AlertDialogDescription>This will update the dual marquee CTA across the site.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => patch({ dualMarquee: draft as any })}>Save</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <SimpleForm
          title=""
          fields={marqueeFields}
          initial={
            {
              ...draft,
              durationSec: String(draft.durationSec),
            } as any
          }
          onSubmit={(values) => {
            const durationSec = Number((values as any).durationSec)
            setDraft({
              label: String((values as any).label ?? ''),
              durationSec: Number.isFinite(durationSec) ? durationSec : 180,
            })
          }}
          onChange={(values) => {
            const durationSec = Number((values as any).durationSec)
            setDraft({
              label: String((values as any).label ?? ''),
              durationSec: Number.isFinite(durationSec) ? durationSec : 180,
            })
          }}
          submitLabel={undefined}
        />
      </div>
    </AdminPageShell>
  )
}

