'use client'

import { useMemo } from 'react'

import { AdminWorkFormPage } from '@/components/admin/work/admin-work-form-page'
import { useToast } from '@/hooks/use-toast'
import { useWorkAdminCollection } from '@/hooks/use-work-admin-collection'
import { createNotificationEventClient } from '@/lib/notifications/client'

import { emptyWork } from './admin-work-fields'

export function AdminWorkNewPage() {
  const { upsert } = useWorkAdminCollection()
  const { toast } = useToast()
  const initial = useMemo(() => emptyWork(), [])

  return (
    <AdminWorkFormPage
      title="Add work"
      description="Create a work entry."
      backHref="/admin/work"
      submitLabel="Create"
      initial={initial}
      onSubmit={async (next) => {
        const ok = await upsert(next)
        if (!ok) return false
        void createNotificationEventClient({
          type: 'WORK_PUBLISHED',
          title: `New work: ${next.title}`,
          summary: next.category || undefined,
          url: `/work/${encodeURIComponent(next.slug || next.title)}`,
          entityId: next.id,
        }).then((result) => {
          if (!result.ok) {
            toast({
              title: 'Published, but notification failed',
              description: result.error ?? `Status: ${result.status || 'network error'}`,
              variant: 'destructive',
            })
          }
        })
        return true
      }}
    />
  )
}

