'use client'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Card } from '@/components/ui/card'

export function AdminVisitorsPage() {
  return (
    <AdminPageShell
      title="Visitors"
      description="Visit analytics are disabled in frontend-only mode."
    >
      <Card className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        Visit analytics are not available in this build.
      </Card>
    </AdminPageShell>
  )
}
