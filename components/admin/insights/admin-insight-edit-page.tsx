'use client'

import { useMemo } from 'react'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { AdminInsightFormPage } from '@/components/admin/insights/admin-insight-form'
import { useInsightAdminCollection } from '@/hooks/use-insight-admin-collection'

import { emptyInsight, type InsightRow } from './admin-insight-fields'

export function AdminInsightEditPage({ id }: { id: string }) {
  const { items, upsert, loading } = useInsightAdminCollection()
  const exists = useMemo(() => items.some((it) => it.id === id), [id, items])

  const initial = useMemo(() => items.find((it) => it.id === id) ?? emptyInsight(), [id, items])

  if (loading) {
    return <AdminLoadingScreen className="min-h-[40vh]" />
  }
  if (!exists) return null

  return (
    <AdminInsightFormPage
      title="Edit insight"
      description="Updates are saved to the database and appear on the public insight page."
      backHref="/admin/insights"
      submitLabel="Update"
      initial={initial}
      onSubmit={(next) => upsert(next)}
      confirmUpdate
    />
  )
}
