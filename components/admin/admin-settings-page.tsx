'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThreeDotsLoader } from '@/components/three-dots-loader'
import { Spinner } from '@/components/ui/spinner'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { useToast } from '@/hooks/use-toast'

const adminDialogClass = 'border-white/10 bg-[#141414] text-white'

type AccountUser = {
  id: string
  email: string
  name: string | null
}

export function AdminSettingsPage() {
  const { logout } = useAdminAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [current, setCurrent] = useState<AccountUser | null>(null)

  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [discardOpen, setDiscardOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const loadAccount = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/account')
      if (!res.ok) throw new Error('Failed to load account')
      const data = (await res.json()) as { user: AccountUser }
      setCurrent(data.user)
      setEmail(data.user.email)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast({
        title: 'Could not load account',
        description: 'Sign in again or refresh the page.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadAccount()
  }, [loadAccount])

  const emailChanged = current ? email.trim().toLowerCase() !== current.email : false
  const passwordChanged = newPassword.length > 0
  const changed = emailChanged || passwordChanged

  const passwordsMatch = !passwordChanged || newPassword === confirmPassword
  const canSave =
    !loading &&
    !saving &&
    changed &&
    currentPassword.length >= 1 &&
    email.trim().length >= 4 &&
    passwordsMatch &&
    (!passwordChanged || newPassword.length >= 8)

  function resetFormToSaved() {
    if (!current) return
    setEmail(current.email)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  async function confirmSave() {
    if (!current) return
    setSaving(true)
    setSaveOpen(false)
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          email: emailChanged ? email.trim() : undefined,
          newPassword: passwordChanged ? newPassword : undefined,
        }),
      })
      const data = (await res.json()) as { error?: string; user?: AccountUser; message?: string }
      if (!res.ok) {
        toast({
          title: 'Update failed',
          description: data.error ?? 'Could not save changes.',
          variant: 'destructive',
        })
        return
      }
      if (data.user) {
        setCurrent(data.user)
        setEmail(data.user.email)
      }
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast({
        title: 'Account updated',
        description:
          data.message ??
          'Your sign-in email and password are saved in the database.',
      })
    } catch {
      toast({
        title: 'Update failed',
        description: 'Network error. Try again.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const saveDescription = useMemo(() => {
    const parts: string[] = []
    if (emailChanged) parts.push('update your sign-in email')
    if (passwordChanged) parts.push('set a new password')
    if (parts.length === 0) return 'Save your account changes to the database.'
    return `This will ${parts.join(' and ')} in the database. You may need to sign in again.`
  }, [emailChanged, passwordChanged])

  function confirmDiscard() {
    resetFormToSaved()
    setDiscardOpen(false)
    toast({
      title: 'Changes discarded',
      description: 'Fields were reset to your saved account.',
    })
  }

  function confirmLogout() {
    setLogoutOpen(false)
    logout()
  }

  const logoutButton = (
    <>
      <Button type="button" variant="secondary" onClick={() => setLogoutOpen(true)}>
        Log out
      </Button>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className={adminDialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/65">
              You will leave the admin dashboard and need to sign in again to continue editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Stay signed in
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-white text-black hover:bg-white/90"
              onClick={confirmLogout}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )

  if (loading) {
    return (
      <AdminPageShell title="Settings" description="Loading your account…" right={logoutButton}>
        <div className="flex justify-center py-16">
          <ThreeDotsLoader />
        </div>
      </AdminPageShell>
    )
  }

  return (
    <AdminPageShell
      title="Settings"
      description="Manage your admin account stored in the database."
      right={logoutButton}
    >
      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6 md:p-7">
          {saving ? (
            <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
              <Spinner className="size-4" />
              Saving…
            </div>
          ) : null}

          <p className="text-sm font-semibold text-white sm:text-base">Account</p>
          <p className="mt-1 text-sm text-white/65">
            Email and password are stored in PostgreSQL (bcrypt). Enter your current password to
            save changes.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-white/80">
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>

            <SettingsPasswordInput
              id="admin-current-password"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword((v) => !v)}
              autoComplete="current-password"
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SettingsPasswordInput
                id="admin-new-password"
                label="New password (optional)"
                value={newPassword}
                onChange={setNewPassword}
                show={showNewPassword}
                onToggleShow={() => setShowNewPassword((v) => !v)}
                autoComplete="new-password"
                hint={
                  passwordChanged && newPassword.length > 0 && newPassword.length < 8
                    ? 'Use at least 8 characters.'
                    : undefined
                }
              />

              <SettingsPasswordInput
                id="admin-confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPassword}
                onToggleShow={() => setShowConfirmPassword((v) => !v)}
                autoComplete="new-password"
                hint={!passwordsMatch ? 'Passwords do not match.' : undefined}
                hintClassName={!passwordsMatch ? 'text-red-300' : undefined}
                disabled={!passwordChanged}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={!changed || saving}
                onClick={() => setDiscardOpen(true)}
              >
                Cancel
              </Button>

              <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
                <AlertDialogContent className={adminDialogClass}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/65">
                      Unsaved edits will be lost. Fields will reset to your saved account.
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

              <Button type="button" disabled={!canSave} onClick={() => setSaveOpen(true)}>
                Save
              </Button>

              <AlertDialog open={saveOpen} onOpenChange={setSaveOpen}>
                <AlertDialogContent className={adminDialogClass}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Save account changes?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/65">
                      {saveDescription}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                      Keep editing
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => void confirmSave()}
                    >
                      Save changes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      </div>
    </AdminPageShell>
  )
}

function SettingsPasswordInput({
  id,
  label,
  value,
  onChange,
  show,
  onToggleShow,
  autoComplete,
  hint,
  hintClassName,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggleShow: () => void
  autoComplete?: string
  hint?: string
  hintClassName?: string
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white/80">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          className="border-white/15 bg-white/5 pr-10 text-white placeholder:text-white/40 disabled:opacity-50"
          type={show ? 'text' : 'password'}
        />
        <button
          type="button"
          onClick={onToggleShow}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:pointer-events-none"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
      {hint ? <p className={`text-xs ${hintClassName ?? 'text-white/50'}`}>{hint}</p> : null}
    </div>
  )
}
