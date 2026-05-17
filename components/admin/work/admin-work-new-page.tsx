'use client'

import { useMemo } from 'react'

import { AdminWorkFormPage } from '@/components/admin/work/admin-work-form-page'
import { useToast } from '@/hooks/use-toast'
import { createNotificationEventClient } from '@/lib/notifications/client'
import { createWorkRowClient } from '@/lib/work-admin-create-client'

import { emptyWork } from './admin-work-fields'

export function AdminWorkNewPage() {
  const { toast } = useToast()
  const initial = useMemo(() => emptyWork(), [])

  return (
    <AdminWorkFormPage
      title="Add work"
      description="Sections match the work grid and project page top to bottom."
      backHref="/admin/work"
      submitLabel="Create work"
      mode="create"
      initial={initial}
      onSubmit={async (next) => {
        const result = await createWorkRowClient(next)
        if (!result.ok) {
          toast({
            title: 'Could not save work',
            description: result.error,
            variant: 'destructive',
          })
          return false
        }
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

