'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { AdminWorkFormPage } from '@/components/admin/work/admin-work-form-page'
import { useWorkAdminCollection } from '@/hooks/use-work-admin-collection'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'
import { Button } from '@/components/ui/button'

import { emptyWork } from './admin-work-fields'
import type { WorkRow } from '@/lib/work-admin-types'

export function AdminWorkEditPage({ id }: { id: string }) {
  const { items, upsert, loading, error } = useWorkAdminCollection()
  const exists = useMemo(() => items.some((it) => it.id === id), [id, items])

  const initialFromCollection = useMemo(
    () => items.find((it) => it.id === id) ?? null,
    [id, items],
  )

  const [fallback, setFallback] = useState<WorkRow | null>(null)
  const [fallbackLoading, setFallbackLoading] = useState(false)
  const initial = initialFromCollection ?? fallback ?? emptyWork()

  useEffect(() => {
    if (!id || exists || initialFromCollection) return
    if (fallback || fallbackLoading) return

    const sessionHeader = getSessionHeaderFromStorage()
    if (!sessionHeader) return

    let cancelled = false
    setFallbackLoading(true)
    void fetch(`/api/admin/work-rows/${encodeURIComponent(id)}`, {
      cache: 'no-store',
      headers: { 'x-session': sessionHeader },
    })
      .then(async (res) => {
        if (!res.ok || cancelled) return
        const data = (await res.json()) as { row?: WorkRow }
        if (!cancelled && data.row?.id) setFallback(data.row)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setFallbackLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [exists, fallback, fallbackLoading, id, initialFromCollection])

  if (loading) {
    return <AdminLoadingScreen className="min-h-[40vh]" />
  }

  if (!id) {
    return (
      <AdminPageShell
        title="Edit work"
        description="Missing work id."
        right={
          <Button asChild variant="secondary">
            <Link href="/leseb-admin/work">Back to work</Link>
          </Button>
        }
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          The edit link is missing an id. Go back to the list and try again.
        </div>
      </AdminPageShell>
    )
  }

  if (!exists && !fallback && fallbackLoading) {
    return <AdminLoadingScreen className="min-h-[40vh]" />
  }

  if (!exists && !fallback) {
    return (
      <AdminPageShell
        title="Edit work"
        description="This work item could not be found."
        right={
          <Button asChild variant="secondary">
            <Link href="/leseb-admin/work">Back to work</Link>
          </Button>
        }
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          {error ? (
            <p className="text-red-300">{error}</p>
          ) : (
            <p>
              The item may have been deleted, or your session may have expired. Return to the list and try again.
            </p>
          )}
        </div>
      </AdminPageShell>
    )
  }

  return (
    <AdminWorkFormPage
      title="Edit work"
      description="Sections match the work grid and project page top to bottom."
      backHref="/leseb-admin/work"
      submitLabel="Save"
      initial={initial}
      onSubmit={(next) => upsert(next)}
      mode="edit"
    />
  )
}
