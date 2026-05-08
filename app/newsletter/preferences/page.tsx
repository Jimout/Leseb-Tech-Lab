'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

type Prefs = {
  notifyWork: boolean
  notifyInsights: boolean
  notifyImportant: boolean
}

const emptyPrefs: Prefs = {
  notifyWork: true,
  notifyInsights: true,
  notifyImportant: true,
}

function NewsletterPreferencesContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const { toast } = useToast()
  const [email, setEmail] = React.useState('')
  const [prefs, setPrefs] = React.useState<Prefs>(emptyPrefs)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`/api/newsletter/preferences?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('load_failed')
        const data = (await res.json()) as {
          subscriber: {
            email: string
            notifyWork: boolean
            notifyInsights: boolean
            notifyImportant: boolean
          }
        }
        setEmail(data.subscriber.email)
        setPrefs({
          notifyWork: data.subscriber.notifyWork,
          notifyInsights: data.subscriber.notifyInsights,
          notifyImportant: data.subscriber.notifyImportant,
        })
        setLoaded(true)
      })
      .catch(() => {
        toast({ title: 'Invalid or expired link', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }, [token])

  const row = (label: string, key: keyof Prefs) => (
    <label className="flex items-center justify-between rounded-md border border-white/10 p-3 text-sm text-white">
      <span>{label}</span>
      <Checkbox checked={prefs[key]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: Boolean(v) }))} />
    </label>
  )

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col gap-4 px-4 py-10">
      <h1 className="text-2xl font-semibold text-white">Newsletter preferences</h1>
      <p className="text-sm text-white/65">Choose what updates you want to receive.</p>
      <Input value={email} disabled placeholder="email" className="border-white/15 bg-white/5 text-white" />
      <div className="grid gap-2">
        {row('New work', 'notifyWork')}
        {row('New insights', 'notifyInsights')}
        {row('Important updates', 'notifyImportant')}
      </div>
      <Button
        disabled={!token || !loaded || loading || saving}
        onClick={async () => {
          setSaving(true)
          try {
            const response = await fetch(`/api/newsletter/preferences?token=${encodeURIComponent(token)}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(prefs),
            })
            if (!response.ok) throw new Error('save_failed')
            toast({ title: 'Preferences updated' })
          } catch {
            toast({ title: 'Failed to save preferences', variant: 'destructive' })
          } finally {
            setSaving(false)
          }
        }}
      >
        {saving ? 'Saving...' : 'Save preferences'}
      </Button>
    </main>
  )
}

export default function NewsletterPreferencesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col gap-4 px-4 py-10">
          <h1 className="text-2xl font-semibold text-white">Newsletter preferences</h1>
          <p className="text-sm text-white/65">Loading preferences...</p>
        </main>
      }
    >
      <NewsletterPreferencesContent />
    </Suspense>
  )
}
