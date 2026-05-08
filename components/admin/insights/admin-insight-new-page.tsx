'use client'

import { AdminInsightFormPage } from '@/components/admin/insights/admin-insight-form'
import { useToast } from '@/hooks/use-toast'
import { useInsightAdminCollection } from '@/hooks/use-insight-admin-collection'
import { createNotificationEventClient } from '@/lib/notifications/client'

import { emptyInsight, type InsightRow } from './admin-insight-fields'

export function AdminInsightNewPage() {
  const { upsert } = useInsightAdminCollection()
  const { toast } = useToast()

  return (
    <AdminInsightFormPage
      title="Add insight"
      description="Slug, listing copy, filters, and article body — saved to the site database. No cover image URL fields."
      backHref="/admin/insights"
      submitLabel="Create"
      initial={emptyInsight()}
      onSubmit={(next) => {
        upsert(next)
        void createNotificationEventClient({
          type: 'INSIGHT_PUBLISHED',
          title: `New insight: ${next.title}`,
          summary: next.description || undefined,
          url: `/insights/${encodeURIComponent(next.slug || next.title)}`,
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
      }}
    />
  )
}
