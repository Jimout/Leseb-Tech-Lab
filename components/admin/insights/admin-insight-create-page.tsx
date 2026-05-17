'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AdminInsightCreateForm } from '@/components/admin/insights/admin-insight-create-form'
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

const adminDialogClass = 'border-white/10 bg-[#141414] text-white'

export function AdminInsightCreatePage() {
  const router = useRouter()
  const [dirty, setDirty] = useState(false)

  const backControl = dirty ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="secondary">
          Back to insights
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
            onClick={() => router.push('/adminopia/insights')}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Button variant="secondary" asChild>
      <Link href="/adminopia/insights">Back to insights</Link>
    </Button>
  )

  return (
    <AdminPageShell
      title="Add insight"
      description="Hero, topics, and article body. Same fields as the public insight page."
      right={backControl}
    >
      <AdminInsightCreateForm
        onDirtyChange={setDirty}
        onCreated={() => router.push('/adminopia/insights')}
      />
    </AdminPageShell>
  )
}
