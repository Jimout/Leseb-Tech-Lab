'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AdminWorkCreateForm } from '@/components/admin/work/admin-work-create-form'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createNotificationEventClient } from '@/lib/notifications/client'
import { createWorkRowClient } from '@/lib/work-admin-create-client'
import type { WorkRow } from '@/lib/work-admin-types'

const adminDialogClass = 'border-white/10 bg-[#141414] text-white'

export function AdminWorkNewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [dirty, setDirty] = useState(false)

  const backControl = dirty ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="secondary">
          Back to work
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={adminDialogClass}>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this page?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/65">
            You have unsaved changes. Stay to keep editing, or leave and discard them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
            Stay
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-white/15 text-white hover:bg-white/20"
            onClick={() => router.push('/leseb-admin/work')}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Button variant="secondary" asChild>
      <Link href="/leseb-admin/work">Back to work</Link>
    </Button>
  )

  const handleSubmit = async (row: WorkRow) => {
    const result = await createWorkRowClient(row)
    if (!result.ok) {
      toast({
        title: 'Could not publish work',
        description: result.error,
        variant: 'destructive',
      })
      return false
    }

    const created = result.row
    void createNotificationEventClient({
      type: 'WORK_PUBLISHED',
      title: `New work: ${created.title}`,
      summary: created.category || undefined,
      url: `/work/${encodeURIComponent(created.slug || created.title)}`,
      entityId: created.id,
    }).then((notifyResult) => {
      if (!notifyResult.ok) {
        toast({
          title: 'Published, but notification failed',
          description: notifyResult.error ?? `Status: ${notifyResult.status || 'network error'}`,
          variant: 'destructive',
        })
      }
    })

    router.push('/leseb-admin/work')
    return true
  }

  return (
    <AdminPageShell
      title="Add work"
      description="Work card, case study intro, fixed story video, and flexible sections below the video."
      right={backControl}
    >
      <AdminWorkCreateForm
        onDirtyChange={setDirty}
        onSubmit={handleSubmit}
      />
    </AdminPageShell>
  )
}
