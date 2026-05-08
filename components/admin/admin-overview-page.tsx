'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Card } from '@/components/ui/card'
import { readJson } from '@/lib/admin/storage'
import type { VisitEvent } from '@/lib/admin/visitors'

const QUICK_LINKS = [
  { href: '/admin/site', title: 'Site sections', description: 'Hero, footer, dual marquee.' },
  { href: '/admin/pages', title: 'Pages', description: 'About + Contact content.' },
  { href: '/admin/privacy', title: 'Privacy', description: 'Privacy policy + policy pages.' },
  { href: '/admin/subscribers', title: 'Subscribers', description: 'Newsletter signups.' },
  { href: '/admin/visitors', title: 'Visitors', description: 'Traffic + pageviews.' },
  { href: '/admin/settings', title: 'Settings', description: 'Admin email + password.' },
] as const

function QuickLinkCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link href={href} className="block">
      <Card className="group rounded-2xl border-white/10 bg-white/5 p-4 transition hover:bg-white/7 sm:p-5 md:p-6 lg:p-6 xl:p-6 2xl:p-7 3xl:p-8 4xl:p-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4 lg:gap-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl">
              {title}
            </p>
            <p className="mt-1 text-sm text-white/65 sm:text-sm lg:text-base xl:text-base 2xl:text-lg 3xl:text-lg 4xl:text-lg">
              {description}
            </p>
          </div>
          <span className="shrink-0 text-lg text-white/40 transition group-hover:text-white/70 sm:text-xl 2xl:text-2xl">
            →
          </span>
        </div>
      </Card>
    </Link>
  )
}

function dayKey(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function lastNDaysKeys(n: number) {
  const out: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    out.push(`${y}-${m}-${day}`)
  }
  return out
}

function BarsChart({
  label,
  values,
}: {
  label: string
  values: { x: string; y: number }[]
}) {
  const max = Math.max(1, ...values.map((v) => v.y))
  return (
    <div className="w-full">
      <p className="text-xs font-semibold tracking-wide text-white/70 sm:text-sm lg:text-sm xl:text-base 2xl:text-base 3xl:text-lg">
        {label}
      </p>
      <div className="mt-3 h-24 w-full">
        <svg viewBox="0 0 100 40" className="h-full w-full">
          {values.map((v, i) => {
            const w = 100 / values.length
            const x = i * w + w * 0.18
            const bw = w * 0.64
            const h = (v.y / max) * 34
            const y = 38 - h
            return (
              <g key={v.x}>
                <rect
                  x={x}
                  y={y}
                  width={bw}
                  height={h}
                  rx={1.8}
                  className="fill-white/18"
                />
              </g>
            )
          })}
          <line x1="0" y1="38.5" x2="100" y2="38.5" className="stroke-white/10" />
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-white/45 sm:text-xs lg:text-sm">
        <span>{values[0]?.x.slice(5)}</span>
        <span>{values[values.length - 1]?.x.slice(5)}</span>
      </div>
    </div>
  )
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="rounded-2xl border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 2xl:p-7 3xl:p-8 4xl:p-8">
      <p className="text-xs font-semibold tracking-wide text-white/60 sm:text-sm lg:text-sm xl:text-base 2xl:text-base">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl xl:text-3xl 2xl:text-4xl 3xl:text-4xl 4xl:text-5xl">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-sm text-white/55 lg:text-base xl:text-base 2xl:text-lg">{hint}</p>
      ) : null}
    </Card>
  )
}

export function AdminOverviewPage() {
  const [subscribers, setSubscribers] = useState<Array<{ createdAt: string }>>([])
  const [visits, setVisits] = useState<VisitEvent[]>([])
  const [insightsCount, setInsightsCount] = useState<number>(0)
  const [resourcesCount, setResourcesCount] = useState<number>(0)
  const [workCount, setWorkCount] = useState<number>(0)

  useEffect(() => {
    fetch('/api/admin/subscribers', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return
        const data = (await response.json()) as { rows: Array<{ createdAt: string }> }
        setSubscribers(data.rows)
      })
      .catch(() => {})

    fetch('/api/admin/visits?limit=1000&range=7d', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          setVisits([])
          return
        }
        const data = (await response.json()) as { rows?: VisitEvent[] }
        setVisits(Array.isArray(data.rows) ? data.rows : [])
      })
      .catch(() => {
        setVisits([])
      })

    const insights = readJson<unknown[]>('admin:insights:v1') ?? []
    const resources = readJson<unknown[]>('admin:resources:v1') ?? []
    const works = readJson<unknown[]>('admin:works:v1') ?? []
    setInsightsCount(Array.isArray(insights) ? insights.length : 0)
    setResourcesCount(Array.isArray(resources) ? resources.length : 0)
    setWorkCount(Array.isArray(works) ? works.length : 0)
  }, [])

  const last7 = useMemo(() => lastNDaysKeys(7), [])

  const visitsSeries = useMemo(() => {
    const counts = new Map<string, number>()
    for (const v of visits) {
      const k = dayKey(v.createdAtIso)
      if (!k) continue
      counts.set(k, (counts.get(k) ?? 0) + 1)
    }
    return last7.map((k) => ({ x: k, y: counts.get(k) ?? 0 }))
  }, [last7, visits])

  const subsSeries = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of subscribers) {
      const k = dayKey(s.createdAt)
      if (!k) continue
      counts.set(k, (counts.get(k) ?? 0) + 1)
    }
    return last7.map((k) => ({ x: k, y: counts.get(k) ?? 0 }))
  }, [last7, subscribers])

  return (
    <AdminPageShell
      title="Overview"
      description="Manage site content, pages, policies, subscribers, and admin settings."
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-6 2xl:gap-7 3xl:gap-8">
        <KpiCard label="Insights" value={String(insightsCount)} hint="Cards in admin storage" />
        <KpiCard label="Resources" value={String(resourcesCount)} hint="Cards in admin storage" />
        <KpiCard label="Work" value={String(workCount)} hint="Cards in admin storage" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 sm:mt-8 lg:mt-10 lg:grid-cols-2 lg:gap-6 xl:gap-6 2xl:gap-7">
        <Card className="rounded-2xl border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 2xl:p-7 3xl:p-8">
          <BarsChart label="Visits (last 7 days)" values={visitsSeries} />
        </Card>
        <Card className="rounded-2xl border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 2xl:p-7 3xl:p-8">
          <BarsChart label="Subscribers (last 7 days)" values={subsSeries} />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 sm:mt-8 lg:mt-10 lg:grid-cols-2 lg:gap-6 2xl:grid-cols-3 2xl:gap-6 3xl:gap-7 4xl:grid-cols-4 4xl:gap-8">
        {QUICK_LINKS.map((l) => (
          <QuickLinkCard
            key={l.href}
            href={l.href}
            title={l.title}
            description={l.description}
          />
        ))}
      </div>
    </AdminPageShell>
  )
}

