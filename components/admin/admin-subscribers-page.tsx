'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminListFilters } from '@/components/admin/admin-list-filters'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog'
import { PillPagination } from '@/components/ui/pill-pagination'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useAdminPagination } from '@/hooks/use-admin-pagination'
import { useToast } from '@/hooks/use-toast'

type SubscriberRow = {
  id: string
  email: string
  status: 'PENDING' | 'ACTIVE' | 'UNSUBSCRIBED'
  createdAt: string
  confirmedAt: string | null
  notifyWork: boolean
  notifyInsights: boolean
  notifyImportant: boolean
}

type NotificationStatusPayload = {
  pendingEvents: number
  failedDeliveries: number
  failedRetryable: number
  lastDispatchAt: string | null
  lastDispatchSummary: Record<string, unknown> | null
  recentFailedSample: Array<{
    id: string
    lastAttemptAt: string | null
    lastError: string | null
    retryCount: number
    eventId: string
    subscriberEmail: string
  }>
}

const DISPATCH_CLIENT_TIMEOUT_MS = 130_000

function formatIso(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminSubscribersPage() {
  const [rows, setRows] = useState<SubscriberRow[]>([])
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'created-desc' | 'created-asc' | 'email-asc' | 'status-asc'>('created-desc')
  const hasSearch = query.trim().length > 0
  const [importantTitle, setImportantTitle] = useState('')
  const [importantSummary, setImportantSummary] = useState('')
  const [importantUrl, setImportantUrl] = useState('/insights')
  const [busy, setBusy] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatusPayload | null>(null)
  const { toast } = useToast()

  const loadNotificationStatus = async () => {
    const response = await fetch('/api/admin/notifications/status', { cache: 'no-store' })
    if (!response.ok) return
    const data = (await response.json()) as NotificationStatusPayload
    setNotificationStatus(data)
  }

  const loadRows = async () => {
    const response = await fetch('/api/admin/subscribers', { cache: 'no-store' })
    if (!response.ok) throw new Error('Failed to load subscribers')
    const data = (await response.json()) as { rows: SubscriberRow[] }
    setRows(data.rows)
  }

  useEffect(() => {
    loadRows().catch(() => {
      toast({
        title: 'Load failed',
        description: 'Could not load subscribers.',
        variant: 'destructive',
      })
    })
    loadNotificationStatus().catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((s) => s.email.toLowerCase().includes(q) || s.status.toLowerCase().includes(q))
  }, [query, rows])

  const sorted = useMemo(() => {
    const next = [...filtered]
    if (sortBy === 'email-asc') next.sort((a, b) => a.email.localeCompare(b.email))
    else if (sortBy === 'status-asc') next.sort((a, b) => a.status.localeCompare(b.status))
    else {
      next.sort((a, b) => {
        const at = new Date(a.createdAt).getTime()
        const bt = new Date(b.createdAt).getTime()
        const safeA = Number.isNaN(at) ? 0 : at
        const safeB = Number.isNaN(bt) ? 0 : bt
        return sortBy === 'created-asc' ? safeA - safeB : safeB - safeA
      })
    }
    return next
  }, [filtered, sortBy])

  const { page, setPage, totalPages, start, end } = useAdminPagination({
    totalItems: sorted.length,
    pageSize: 5,
  })
  const pageItems = sorted.slice(start, end)

  return (
    <AdminPageShell
      title="Subscribers"
      description="Newsletter subscribers and confirmation timestamps."
      right={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              const csv = ['email,status,createdAt,confirmedAt', ...rows.map((r) => `${r.email},${r.status},${r.createdAt},${r.confirmedAt ?? ''}`)].join('\n')
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'subscribers.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
            disabled={rows.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            disabled={busy}
            title="Runs the same job as the GitHub Action: processes queued notification events (session auth)."
            onClick={async () => {
              setBusy(true)
              const ac = new AbortController()
              const tid = setTimeout(() => ac.abort(), DISPATCH_CLIENT_TIMEOUT_MS)
              try {
                const response = await fetch('/api/notifications/dispatch', {
                  method: 'POST',
                  signal: ac.signal,
                })
                if (!response.ok) throw new Error('Dispatch failed')
                const data = (await response.json()) as {
                  eventsProcessed: number
                  sent: number
                  failed: number
                  skippedConcurrent?: boolean
                  timedOut?: boolean
                  maxSendsReached?: boolean
                }
                if (data.skippedConcurrent) {
                  toast({
                    title: 'Dispatch already running',
                    description: 'Another dispatch is in progress. Try again shortly.',
                  })
                } else {
                  const extras = [
                    data.timedOut ? 'stopped: time budget' : null,
                    data.maxSendsReached ? 'stopped: send cap' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')
                  toast({
                    title: 'Retry complete',
                    description: `Events: ${data.eventsProcessed}, sent: ${data.sent}, failed: ${data.failed}${extras ? ` (${extras})` : ''}`,
                  })
                }
                await loadNotificationStatus()
              } catch (e) {
                const name = e instanceof Error ? e.name : ''
                if (name === 'AbortError') {
                  toast({
                    title: 'Request timed out',
                    description: 'The server may still be processing; check notification status below.',
                    variant: 'destructive',
                  })
                } else {
                  toast({ title: 'Retry failed', variant: 'destructive' })
                }
              } finally {
                clearTimeout(tid)
                setBusy(false)
              }
            }}
          >
            Retry pending notifications
          </Button>
        </div>
      }
    >
      <Card className="mb-4 rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
        <p className="text-sm font-semibold text-white">Notification queue</p>
        <p className="mt-1 text-sm text-white/65">
          Persisted delivery errors live on each delivery row; last run metadata is stored after each dispatch (including manual).
        </p>
        {notificationStatus ? (
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2">
              <dt className="text-white/65">Pending events</dt>
              <dd className="font-medium text-white">{notificationStatus.pendingEvents}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2">
              <dt className="text-white/65">Failed deliveries (all)</dt>
              <dd className="font-medium text-white">{notificationStatus.failedDeliveries}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2 sm:border-b-0 sm:pb-0">
              <dt className="text-white/65">Failed (retryable)</dt>
              <dd className="font-medium text-white">{notificationStatus.failedRetryable}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/10 pb-2 sm:border-b-0 sm:pb-0">
              <dt className="text-white/65">Last dispatch</dt>
              <dd className="text-right font-medium text-white">
                {notificationStatus.lastDispatchAt ? formatIso(notificationStatus.lastDispatchAt) : '—'}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-white/50">Loading status…</p>
        )}
        {notificationStatus?.recentFailedSample?.[0]?.lastError ? (
          <p
            className="mt-3 line-clamp-2 text-xs text-amber-200/90"
            title={notificationStatus.recentFailedSample[0].lastError}
          >
            Latest error: {notificationStatus.recentFailedSample[0].lastError}
          </p>
        ) : null}
      </Card>

      <Card className="mb-4 rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
        <p className="text-sm font-semibold text-white">Important update broadcast</p>
        <p className="mt-1 text-sm text-white/65">
          Creates the event and dispatches immediately. Use Retry pending notifications (toolbar) for queued or failed sends.
        </p>
        <div className="mt-4 grid gap-3">
          <Input
            value={importantTitle}
            onChange={(e) => setImportantTitle(e.target.value)}
            placeholder="Important: portfolio maintenance window"
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
          <Textarea
            value={importantSummary}
            onChange={(e) => setImportantSummary(e.target.value)}
            rows={3}
            placeholder="Optional summary shown in email."
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
          <Input
            value={importantUrl}
            onChange={(e) => setImportantUrl(e.target.value)}
            placeholder="/insights"
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
          <div>
            <Button
              disabled={busy || importantTitle.trim().length < 2}
              onClick={async () => {
                setBusy(true)
                try {
                  const response = await fetch('/api/notifications/event', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'IMPORTANT_UPDATE',
                      title: importantTitle.trim(),
                      summary: importantSummary.trim() || undefined,
                      url: importantUrl.trim() || '/',
                      dispatchNow: true,
                    }),
                  })
                  if (!response.ok) throw new Error('Failed')
                  setImportantTitle('')
                  setImportantSummary('')
                  setImportantUrl('/insights')
                  toast({ title: 'Important event created' })
                } catch {
                  toast({
                    title: 'Failed to create event',
                    variant: 'destructive',
                  })
                } finally {
                  setBusy(false)
                }
              }}
            >
              Create important event
            </Button>
          </div>
        </div>
      </Card>
      <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{rows.length} total</p>
            <p className="text-sm text-white/65">Search and unsubscribe subscribers.</p>
          </div>
          <AdminListFilters
            query={query}
            onQueryChange={(value) => {
              setQuery(value)
              setPage(1)
            }}
            queryPlaceholder="Search subscribers..."
            sortValue={sortBy}
            onSortChange={(value) => {
              setSortBy(value as 'created-desc' | 'created-asc' | 'email-asc' | 'status-asc')
              setPage(1)
            }}
            sortOptions={[
              { value: 'created-desc', label: 'Newest first' },
              { value: 'created-asc', label: 'Oldest first' },
              { value: 'email-asc', label: 'Email (A-Z)' },
              { value: 'status-asc', label: 'Status (A-Z)' },
            ]}
            className="mb-0 sm:min-w-88"
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Email</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Created at</TableHead>
                <TableHead className="text-white/70">Confirmed at</TableHead>
                <TableHead className="text-right text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-white/60">
                    {hasSearch
                      ? 'No subscribers match your search. Try a different keyword.'
                      : 'No subscribers found yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((r) => (
                  <TableRow key={r.id} className="border-white/10">
                    <TableCell className="font-medium text-white">{r.email}</TableCell>
                    <TableCell className="text-white/70">{r.status}</TableCell>
                    <TableCell className="text-white/70">{formatIso(r.createdAt)}</TableCell>
                    <TableCell className="text-white/70">{r.confirmedAt ? formatIso(r.confirmedAt) : '—'}</TableCell>
                    <TableCell className="text-right">
                      <ConfirmDeleteDialog
                        title="Unsubscribe this user?"
                        description={`Stop sending updates to ${r.email}.`}
                        confirmLabel="Unsubscribe"
                        onConfirm={async () => {
                          const response = await fetch(`/api/admin/subscribers/${encodeURIComponent(r.id)}`, {
                            method: 'DELETE',
                          })
                          if (!response.ok) {
                            toast({ title: 'Failed to unsubscribe', variant: 'destructive' })
                            return
                          }
                          await loadRows()
                        }}
                      >
                        <Button variant="destructive" size="sm">
                          Unsubscribe
                        </Button>
                      </ConfirmDeleteDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 ? (
          <div className="mt-6 flex justify-center">
            <PillPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        ) : null}
      </Card>
    </AdminPageShell>
  )
}

