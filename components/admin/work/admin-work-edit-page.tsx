'use client'

import { useMemo } from 'react'

import { AdminWorkFormPage } from '@/components/admin/work/admin-work-form-page'
import { useWorkAdminCollection } from '@/hooks/use-work-admin-collection'

import { emptyWork } from './admin-work-fields'

export function AdminWorkEditPage({ id }: { id: string }) {
  const { items, upsert, loading } = useWorkAdminCollection()
  const exists = useMemo(() => items.some((it) => it.id === id), [id, items])

  const initial = useMemo(() => items.find((it) => it.id === id) ?? emptyWork(), [id, items])

  if (loading) return null
  if (!exists) return null

  return (
    <AdminWorkFormPage
      title="Edit work"
      description="Update this work entry."
      backHref="/admin/work"
      submitLabel="Update"
      initial={initial}
      onSubmit={(next) => upsert(next)}
      confirmUpdate
    />
  )
}

