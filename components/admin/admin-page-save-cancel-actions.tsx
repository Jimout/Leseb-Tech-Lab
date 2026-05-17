'use client'

import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const adminDialogClass = 'border-white/10 bg-[#141414] text-white'

type AdminPageSaveCancelActionsProps = {
  changed: boolean
  pageName: string
  /** Shown in the save confirmation when `saveDescription` is not set. */
  publicPath?: string
  saveTitle?: string
  saveDescription?: string
  discardTitle?: string
  discardDescription?: string
  onSave: () => void
  onDiscard: () => void
}

export function AdminPageSaveCancelActions({
  changed,
  pageName,
  publicPath,
  saveTitle,
  saveDescription,
  discardTitle,
  discardDescription,
  onSave,
  onDiscard,
}: AdminPageSaveCancelActionsProps) {
  const { toast } = useToast()
  const [saveOpen, setSaveOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)

  const resolvedSaveTitle = saveTitle ?? `Save ${pageName}?`
  const resolvedSaveDescription =
    saveDescription ??
    (publicPath ? (
      <>
        This will publish your changes to the live{' '}
        <span className="text-white/85">{publicPath}</span> page for all visitors.
      </>
    ) : (
      <>This will publish your changes for all visitors.</>
    ))
  const resolvedDiscardTitle = discardTitle ?? 'Discard changes?'
  const resolvedDiscardDescription =
    discardDescription ??
    `Unsaved edits to the ${pageName} page will be lost. Fields will reset to the last saved version.`

  function confirmDiscard() {
    onDiscard()
    setDiscardOpen(false)
    toast({
      title: 'Changes discarded',
      description: `${pageName} fields were reset to the last saved version.`,
    })
  }

  function confirmSave() {
    onSave()
    setSaveOpen(false)
    toast({
      title: 'Changes saved',
      description: publicPath
        ? `The public ${publicPath} page has been updated.`
        : `${pageName} have been updated.`,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        disabled={!changed}
        onClick={() => setDiscardOpen(true)}
      >
        Cancel
      </Button>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent className={adminDialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle>{resolvedDiscardTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-white/65">
              {resolvedDiscardDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-white text-black hover:bg-white/90"
              onClick={confirmDiscard}
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button type="button" disabled={!changed} onClick={() => setSaveOpen(true)}>
        Save
      </Button>

      <AlertDialog open={saveOpen} onOpenChange={setSaveOpen}>
        <AlertDialogContent className={adminDialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle>{resolvedSaveTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-white/65">
              {resolvedSaveDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={confirmSave}
            >
              Save changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
