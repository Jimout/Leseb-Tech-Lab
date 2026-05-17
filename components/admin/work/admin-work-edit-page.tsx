'use client'

import { useMemo } from 'react'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'
import { AdminWorkFormPage } from '@/components/admin/work/admin-work-form-page'
import { useWorkAdminCollection } from '@/hooks/use-work-admin-collection'

import { emptyWork } from './admin-work-fields'

export function AdminWorkEditPage({ id }: { id: string }) {
  const { items, upsert, loading } = useWorkAdminCollection()
  const exists = useMemo(() => items.some((it) => it.id === id), [id, items])

  const initial = useMemo(() => items.find((it) => it.id === id) ?? emptyWork(), [id, items])

  if (loading) {
    return <AdminLoadingScreen message="Loading project" className="min-h-[40vh]" />
  }
  if (!exists) return null

  return (
    <AdminWorkFormPage
      title="Edit work"
      description="Sections match the work grid and project page top to bottom."
      backHref="/admin/work"
      submitLabel="Save"
      initial={initial}
      onSubmit={(next) => upsert(next)}
      mode="edit"
    />
  )
}

