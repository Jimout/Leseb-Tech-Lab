'use client'

import { useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog'
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
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { useToast } from '@/hooks/use-toast'
import { readAdminCreds, writeAdminCreds } from '@/lib/admin/auth'

const adminDialogClass = 'border-white/10 bg-[#141414] text-white'

export function AdminSettingsPage() {
  const { logout } = useAdminAuth()
  const { toast } = useToast()
  const [current, setCurrent] = useState(() => readAdminCreds())

  const [email, setEmail] = useState(current.email)
  const [password, setPassword] = useState(current.password)
  const [confirmPassword, setConfirmPassword] = useState(current.password)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [discardOpen, setDiscardOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const changed = useMemo(
    () => email.trim() !== current.email || password !== current.password,
    [current.email, current.password, email, password],
  )

  const passwordsMatch = confirmPassword === password
  const canSave = changed && email.trim().length >= 4 && password.length >= 1 && passwordsMatch

  function resetFormToSaved() {
    setEmail(current.email)
    setPassword(current.password)
    setConfirmPassword(current.password)
  }

  function confirmDiscard() {
    resetFormToSaved()
    setDiscardOpen(false)
    toast({
      title: 'Changes discarded',
      description: 'Email and password fields were reset to the last saved values.',
    })
  }

  function confirmSave() {
    const next = { email: email.trim(), password }
    writeAdminCreds(next)
    setCurrent(next)
    setConfirmPassword(next.password)
    setSaveOpen(false)
    toast({
      title: 'Credentials saved',
      description: 'Admin login for this browser has been updated.',
    })
  }

  function confirmLogout() {
    setLogoutOpen(false)
    logout()
  }

  return (
    <AdminPageShell
      title="Settings"
      description="Manage admin credentials for this browser."
      right={
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
      }
    >
      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6 md:p-7 lg:p-7 xl:p-8 2xl:p-8 3xl:p-9 4xl:p-9">
          <p className="text-sm font-semibold text-white sm:text-base lg:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl">
            Admin credentials
          </p>
          <p className="mt-1 text-sm text-white/65 sm:text-base lg:text-base 2xl:text-lg 3xl:text-lg">
            Stored locally in this browser (not secure production auth).
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-white/80">
                Email
              </Label>
              <Input
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:col-span-2 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-white/80">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-white/15 bg-white/5 pr-10 text-white placeholder:text-white/40"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden />
                    ) : (
                      <Eye className="size-4" aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-confirm-password" className="text-white/80">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-white/15 bg-white/5 pr-10 text-white placeholder:text-white/40"
                    type={showConfirmPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" aria-hidden />
                    ) : (
                      <Eye className="size-4" aria-hidden />
                    )}
                  </button>
                </div>
                {!passwordsMatch ? (
                  <p className="text-xs text-red-300">Passwords do not match.</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
                    <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/65">
                      Unsaved edits to email or password will be lost. Fields will reset to the last saved
                      values.
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
                    <AlertDialogTitle>Save credentials?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/65">
                      This will update the admin email and password used to sign in on this browser.
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

            <ConfirmDeleteDialog
              title="Reset credentials?"
              description="This will reset admin email/password to default for this browser."
              confirmLabel="Reset"
              onConfirm={() => {
                const next = { email: 'admin@leseb.com', password: 'admin123' }
                writeAdminCreds(next)
                setCurrent(next)
                setEmail(next.email)
                setPassword(next.password)
                setConfirmPassword(next.password)
                toast({
                  title: 'Credentials reset',
                  description: 'Admin login was restored to the default for this browser.',
                })
              }}
            >
              <Button type="button" variant="destructive">
                Reset to default
              </Button>
            </ConfirmDeleteDialog>
          </div>
        </Card>
      </div>
    </AdminPageShell>
  )
}
