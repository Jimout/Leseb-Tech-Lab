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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { readAdminCreds, writeAdminCreds } from '@/lib/admin/auth'

export function AdminSettingsPage() {
  const { logout } = useAdminAuth()
  const [current, setCurrent] = useState(() => readAdminCreds())

  const [email, setEmail] = useState(current.email)
  const [password, setPassword] = useState(current.password)
  const [confirmPassword, setConfirmPassword] = useState(current.password)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const changed = useMemo(() => email.trim() !== current.email || password !== current.password, [
    current.email,
    current.password,
    email,
    password,
  ])

  const passwordsMatch = confirmPassword === password
  const canSave = changed && email.trim().length >= 4 && password.length >= 1 && passwordsMatch

  return (
    <AdminPageShell
      title="Settings"
      description="Manage admin credentials for this browser."
      right={
        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" disabled={!changed}>
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will revert the email and password fields to the last saved values.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setEmail(current.email)
                      setPassword(current.password)
                      setConfirmPassword(current.password)
                    }}
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!canSave}>Save</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save credentials?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will update the admin email/password for this browser.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const next = { email: email.trim(), password }
                      writeAdminCreds(next)
                      setCurrent(next)
                      setConfirmPassword(next.password)
                    }}
                  >
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <ConfirmDeleteDialog
              title="Reset credentials?"
              description="This will reset admin email/password to default for this browser."
              confirmLabel="Reset"
              onConfirm={() => {
                const next = { email: 'admin@nattyopia.com', password: 'admin123' }
                writeAdminCreds(next)
                setCurrent(next)
                setEmail(next.email)
                setPassword(next.password)
                setConfirmPassword(next.password)
              }}
            >
              <Button variant="destructive">Reset to default</Button>
            </ConfirmDeleteDialog>
          </div>
        </Card>
      </div>
    </AdminPageShell>
  )
}

