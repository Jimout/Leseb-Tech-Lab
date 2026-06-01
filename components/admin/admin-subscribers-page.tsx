'use client'

import { useEffect, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Card } from '@/components/ui/card'

export function AdminSubscribersPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <AdminPageShell
      title="Subscribers"
      description="Newsletter subscribers are disabled in frontend-only mode."
    >
      <Card className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        {ready
          ? 'Newsletter signup is not available in this build. Contact forms on the site still work locally in the browser.'
          : 'Loading…'}
      </Card>
    </AdminPageShell>
  )
}
