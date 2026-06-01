'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { DEFAULT_ADMIN_NAV_GROUPS } from '@/components/admin/admin-nav-config'
import { Card } from '@/components/ui/card'
import { readInsightsFromStorage, readWorkRowsFromStorage } from '@/lib/frontend-content'
import { SHOWCASE_INSIGHTS } from '@/lib/insights-showcase-data'
import { SHOWCASE_WORKS } from '@/lib/works-showcase-data'
import { cn } from '@/lib/utils'

const LINK_HINTS: Record<string, string> = {
  '/leseb-admin/insights': 'Create and edit insight articles.',
  '/leseb-admin/work': 'Manage work projects.',
  '/leseb-admin/site/hero': 'Homepage hero headline and intro.',
  '/leseb-admin/site/footer': 'Footer panels, contact, and social links.',
  '/leseb-admin/site/insight-toc': 'Logo beside article table of contents.',
  '/leseb-admin/site/catalog-filters': 'Categories for /work and /insights filters.',
  '/leseb-admin/privacy': 'Privacy policy copy.',
  '/leseb-admin/pages/about': 'About page sections and letter.',
  '/leseb-admin/pages/contact': 'Contact page hero and form.',
  '/leseb-admin/subscribers': 'Newsletter signups.',
  '/leseb-admin/visitors': 'Traffic and pageviews.',
  '/leseb-admin/settings': 'Admin email and password for this browser.',
}

const QUICK_SECTIONS = DEFAULT_ADMIN_NAV_GROUPS.filter((group) => group.id !== 'core').map(
  (group) => ({
    title: group.label,
    links: group.items.map((item) => ({
      href: item.href,
      title: item.label,
      description: LINK_HINTS[item.href] ?? '',
    })),
  }),
)

const KPI_ITEMS = [
  { key: 'insights', label: 'Insights', hint: 'Published articles' },
  { key: 'work', label: 'Work', hint: 'Portfolio projects' },
  { key: 'subscribers', label: 'Subscribers', hint: 'Total signups' },
  { key: 'visits', label: 'Visits', hint: 'Last 7 days' },
] as const

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
    <div className="min-w-0">
      <p className="text-sm font-medium text-white/80">{label}</p>
      <div className="mt-3 h-24 w-full">
        <svg viewBox="0 0 100 40" className="h-full w-full" aria-hidden>
          {values.map((v, i) => {
            const w = 100 / values.length
            const x = i * w + w * 0.18
            const bw = w * 0.64
            const h = (v.y / max) * 34
            const y = 38 - h
            return <rect key={v.x} x={x} y={y} width={bw} height={h} rx={1.8} className="fill-white/18" />
          })}
          <line x1="0" y1="38.5" x2="100" y2="38.5" className="stroke-white/10" />
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-white/45">
        <span>{values[0]?.x.slice(5)}</span>
        <span>{values[values.length - 1]?.x.slice(5)}</span>
      </div>
    </div>
  )
}

function ShortcutCard({
  href,
  title,
  description,
  section,
}: {
  href: string
  title: string
  description: string
  section: string
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/[0.07] sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{section}</p>
        <div className="mt-3 flex flex-1 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-white sm:text-base">{title}</p>
            {description ? (
              <p className="mt-1.5 break-words text-sm leading-relaxed text-white/55">{description}</p>
            ) : null}
          </div>
          <ChevronRight
            className="mt-0.5 size-4 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/65"
            aria-hidden
          />
        </div>
      </Card>
    </Link>
  )
}

export function AdminOverviewPage() {
  const [subscribers, setSubscribers] = useState<Array<{ createdAt: string }>>([])
  const [visits, setVisits] = useState<Array<{ createdAtIso: string }>>([])
  const [insightsCount, setInsightsCount] = useState(0)
  const [workCount, setWorkCount] = useState(0)

  useEffect(() => {
    const storedInsights = readInsightsFromStorage()
    const storedWork = readWorkRowsFromStorage()
    setInsightsCount(storedInsights.length || SHOWCASE_INSIGHTS.length)
    setWorkCount(storedWork.length || SHOWCASE_WORKS.length)
    setSubscribers([])
    setVisits([])
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

  const visits7d = useMemo(() => visitsSeries.reduce((sum, row) => sum + row.y, 0), [visitsSeries])

  const kpiValues: Record<(typeof KPI_ITEMS)[number]['key'], string> = {
    insights: String(insightsCount),
    work: String(workCount),
    subscribers: String(subscribers.length),
    visits: String(visits7d),
  }

  return (
    <AdminPageShell
      title="Overview"
      description="Activity at a glance and shortcuts to every section in the dashboard."
    >
      <div className="min-w-0 space-y-6 lg:space-y-8">
        <Card className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid min-w-0 grid-cols-2 lg:grid-cols-4">
            {KPI_ITEMS.map((item, index) => (
              <div
                key={item.key}
                className={cn(
                  'min-w-0 px-4 py-4 sm:px-5 sm:py-5',
                  index % 2 === 0 && 'border-r border-white/10',
                  index < 2 && 'border-b border-white/10 lg:border-b-0',
                  index < 3 && 'lg:border-r lg:border-white/10',
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{item.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">{kpiValues[item.key]}</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{item.hint}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Activity</h2>
          <div className="mt-4 grid min-w-0 gap-6 sm:grid-cols-2 sm:gap-8">
            <BarsChart label="Visits" values={visitsSeries} />
            <BarsChart label="New subscribers" values={subsSeries} />
          </div>
          <p className="mt-4 text-xs text-white/40">Last 7 days</p>
        </Card>

        <section className="min-w-0" aria-labelledby="overview-shortcuts-heading">
          <h2
            id="overview-shortcuts-heading"
            className="text-sm font-semibold uppercase tracking-wider text-white/50"
          >
            Shortcuts
          </h2>
          <nav className="mt-5 space-y-8 sm:mt-6 sm:space-y-10" aria-label="Dashboard sections">
            {QUICK_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">{section.title}</h3>
                <ul className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {section.links.map((link) => (
                    <li key={link.href} className="min-h-0">
                      <ShortcutCard {...link} section={section.title} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </section>
      </div>
    </AdminPageShell>
  )
}
