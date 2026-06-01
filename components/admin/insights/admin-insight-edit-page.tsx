'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { AdminInsightFormPage } from '@/components/admin/insights/admin-insight-form'
import { useInsightAdminCollection } from '@/hooks/use-insight-admin-collection'
import { readInsightsFromStorage } from '@/lib/frontend-content'
import { isAdminLoggedIn } from '@/lib/frontend-auth'
import { Button } from '@/components/ui/button'

import { emptyInsight, type InsightRow } from './admin-insight-fields'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'

export function AdminInsightEditPage({ id }: { id: string }) {
  const { items, upsert, loading, error } = useInsightAdminCollection()
  const exists = useMemo(() => items.some((it) => it.id === id), [id, items])

  const initialFromCollection = useMemo(
    () => items.find((it) => it.id === id) ?? null,
    [id, items],
  )

  const [fallback, setFallback] = useState<ShowcaseInsight | null>(null)
  const [fallbackLoading, setFallbackLoading] = useState(false)
  const initial = (initialFromCollection ?? fallback ?? emptyInsight()) as InsightRow

  useEffect(() => {
    if (!id || exists || initialFromCollection) return
    if (fallback || fallbackLoading) return

    if (!isAdminLoggedIn()) return

    let cancelled = false
    setFallbackLoading(true)
    const row = readInsightsFromStorage().find((it) => it.id === id) ?? null
    if (!cancelled) {
      if (row) setFallback(row)
      setFallbackLoading(false)
    }

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
        title="Edit insight"
        description="Missing insight id."
        right={
          <Button asChild variant="secondary">
            <Link href="/leseb-admin/insights">Back to insights</Link>
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
        title="Edit insight"
        description="This insight could not be found."
        right={
          <Button asChild variant="secondary">
            <Link href="/leseb-admin/insights">Back to insights</Link>
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
    <AdminInsightFormPage
      title="Edit insight"
      description="Updates are saved in this browser and appear on the public insight page."
      backHref="/leseb-admin/insights"
      submitLabel="Update"
      initial={initial}
      onSubmit={(next) => upsert(next)}
      confirmUpdate
    />
  )
}
