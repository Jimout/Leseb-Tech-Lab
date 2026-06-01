'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { useToast } from '@/hooks/use-toast'
import {
  defaultAdminAccount,
  readAdminAccount,
  writeAdminAccount,
} from '@/lib/frontend-auth'

export function AdminSettingsPage() {
  const { logout } = useAdminAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const account = readAdminAccount()
    setEmail(account.email)
  }, [])

  const saved = useMemo(() => readAdminAccount(), [email, newPassword])
  const emailChanged = email.trim().toLowerCase() !== saved.email.toLowerCase()
  const passwordChanged = newPassword.length > 0
  const changed = emailChanged || passwordChanged
  const passwordsMatch = !passwordChanged || newPassword === confirmPassword
  const canSave =
    changed &&
    currentPassword.length >= 1 &&
    email.trim().length >= 4 &&
    passwordsMatch &&
    (!passwordChanged || newPassword.length >= 8)

  function handleSave() {
    const account = readAdminAccount()
    if (currentPassword !== account.password) {
      toast({
        title: 'Update failed',
        description: 'Current password is incorrect.',
        variant: 'destructive',
      })
      return
    }

    writeAdminAccount({
      email: email.trim(),
      password: passwordChanged ? newPassword : account.password,
      name: account.name,
    })

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

    toast({
      title: 'Credentials updated',
      description: 'Admin login for this browser has been saved locally.',
    })
  }

  return (
    <AdminPageShell
      title="Admin credentials"
      description="Login details are stored in this browser only (frontend-only mode)."
      right={
        <Button type="button" variant="secondary" onClick={logout}>
          Log out
        </Button>
      }
    >
      <Card className="max-w-xl space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-2">
          <Label htmlFor="admin-settings-email">Email</Label>
          <Input
            id="admin-settings-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/15 bg-background/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-settings-current">Current password</Label>
          <div className="relative">
            <Input
              id="admin-settings-current"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-white/15 bg-background/30 pr-10 text-white"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/55"
              onClick={() => setShowCurrentPassword((v) => !v)}
            >
              {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-settings-new">New password</Label>
          <div className="relative">
            <Input
              id="admin-settings-new"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-white/15 bg-background/30 pr-10 text-white"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/55"
              onClick={() => setShowNewPassword((v) => !v)}
            >
              {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-settings-confirm">Confirm new password</Label>
          <div className="relative">
            <Input
              id="admin-settings-confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-white/15 bg-background/30 pr-10 text-white"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/55"
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={!canSave} onClick={handleSave}>
            Save credentials
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const defaults = defaultAdminAccount()
              setEmail(defaults.email)
              setCurrentPassword('')
              setNewPassword('')
              setConfirmPassword('')
            }}
          >
            Reset form
          </Button>
        </div>

        <p className="text-sm text-white/55">
          Default login: {defaultAdminAccount().email} / {defaultAdminAccount().password}
        </p>
      </Card>
    </AdminPageShell>
  )
}
