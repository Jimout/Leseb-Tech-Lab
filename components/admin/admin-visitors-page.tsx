
'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { AdminListFilters } from '@/components/admin/admin-list-filters'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Card } from '@/components/ui/card'
import { PillPagination } from '@/components/ui/pill-pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminPagination } from '@/hooks/use-admin-pagination'
import { readJson } from '@/lib/admin/storage'
import type { VisitEvent } from '@/lib/admin/visitors'
import { SHOWCASE_INSIGHTS } from '@/lib/insights-showcase-data'
import { SHOWCASE_WORKS } from '@/lib/works-showcase-data'

function normalizePath(path: string) {
  return path.trim().split('#')[0]?.split('?')[0] ?? ''
}

function parseDetailId(path: string, prefix: string) {
  const normalized = normalizePath(path)
  if (!normalized.startsWith(prefix)) return null
  const rest = normalized.slice(prefix.length)
  const part = rest.split('/').filter(Boolean)[0]
  if (!part) return null
  try {
    return decodeURIComponent(part)
  } catch {
    return part
  }
}

function countBy<T extends string>(items: readonly T[]) {
  const map = new Map<T, number>()
  for (const it of items) map.set(it, (map.get(it) ?? 0) + 1)
  return map
}

type RangeKey = 'today' | '7d' | '30d' | 'all'

export function AdminVisitorsPage() {
  const [rows, setRows] = useState<VisitEvent[]>([])
  const [range, setRange] = useState<RangeKey>('7d')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'views-desc' | 'views-asc' | 'title-asc'>('views-desc')
  const [titleVersion, setTitleVersion] = useState(0)

  useEffect(() => {
    const tick = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const params = new URLSearchParams({
          limit: '1000',
          range,
        })
        const res = await fetch(`/api/admin/visits?${params.toString()}`, { cache: 'no-store' })
        if (!res.ok) {
          setRows([])
          return
        }
        const data = (await res.json()) as { rows?: VisitEvent[] }
        setRows(Array.isArray(data.rows) ? data.rows : [])
      } catch {
        setRows([])
      }
    }
    void tick()
    const id = window.setInterval(() => void tick(), 30000)
    return () => window.clearInterval(id)
  }, [range])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      const key = event.key
      if (key === 'admin:insights:v1' || key === 'admin:works:v1') {
        setTitleVersion((v) => v + 1)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const rangeRows = rows
  const rangeViewRows = rangeRows

  const { workViews, insightViews } = useMemo(() => {
    const work: string[] = []
    const insight: string[] = []
    for (const v of rangeViewRows) {
      const w = parseDetailId(v.path, '/work/')
      if (w) work.push(w)
      const i = parseDetailId(v.path, '/insights/')
      if (i) insight.push(i)
    }
    return { workViews: work, insightViews: insight }
  }, [rangeViewRows])

  const titles = useMemo(
    () => {
      const insightById = new Map<string, string>(SHOWCASE_INSIGHTS.map((item) => [item.id, item.title]))
      const workById = new Map<string, string>(SHOWCASE_WORKS.map((item) => [item.id, item.title]))

      const insights = readJson<Array<{ id?: unknown; title?: unknown }>>('admin:insights:v1') ?? []
      for (const item of insights) {
        const id = typeof item.id === 'string' ? item.id.trim() : ''
        const title = typeof item.title === 'string' ? item.title.trim() : ''
        if (id && title) insightById.set(id, title)
      }

      const works = readJson<Array<{ id?: unknown; title?: unknown }>>('admin:works:v1') ?? []
      for (const item of works) {
        const id = typeof item.id === 'string' ? item.id.trim() : ''
        const title = typeof item.title === 'string' ? item.title.trim() : ''
        if (id && title) workById.set(id, title)
      }

      return { insightById, workById }
    },
    [titleVersion],
  )

  const workCounts = useMemo(() => countBy(workViews), [workViews])
  const insightCounts = useMemo(() => countBy(insightViews), [insightViews])
  const topWork = useMemo(() => {
    return Array.from(workCounts.entries()).sort((a, b) => b[1] - a[1])
  }, [workCounts])
  const topInsights = useMemo(() => {
    return Array.from(insightCounts.entries()).sort((a, b) => b[1] - a[1])
  }, [insightCounts])
  const searchQuery = query.trim().toLowerCase()

  const filteredTopWork = useMemo(() => {
    const base = !searchQuery
      ? topWork
      : topWork.filter(([id]) => (titles.workById.get(id) ?? id).toLowerCase().includes(searchQuery))
    const next = [...base]
    if (sortBy === 'title-asc') {
      next.sort(([a], [b]) => (titles.workById.get(a) ?? a).localeCompare(titles.workById.get(b) ?? b))
    } else if (sortBy === 'views-asc') {
      next.sort((a, b) => a[1] - b[1])
    } else {
      next.sort((a, b) => b[1] - a[1])
    }
    return next
  }, [searchQuery, sortBy, titles.workById, topWork])

  const filteredTopInsights = useMemo(() => {
    const base = !searchQuery
      ? topInsights
      : topInsights.filter(([id]) => (titles.insightById.get(id) ?? id).toLowerCase().includes(searchQuery))
    const next = [...base]
    if (sortBy === 'title-asc') {
      next.sort(([a], [b]) => (titles.insightById.get(a) ?? a).localeCompare(titles.insightById.get(b) ?? b))
    } else if (sortBy === 'views-asc') {
      next.sort((a, b) => a[1] - b[1])
    } else {
      next.sort((a, b) => b[1] - a[1])
    }
    return next
  }, [searchQuery, sortBy, titles.insightById, topInsights])

  const {
    page: workPage,
    setPage: setWorkPage,
    totalPages: workTotalPages,
    start: workStart,
    end: workEnd,
  } = useAdminPagination({ totalItems: filteredTopWork.length })
  const {
    page: insightPage,
    setPage: setInsightPage,
    totalPages: insightTotalPages,
    start: insightStart,
    end: insightEnd,
  } = useAdminPagination({ totalItems: filteredTopInsights.length })
  useEffect(() => {
    setWorkPage(1)
    setInsightPage(1)
  }, [range, searchQuery, sortBy, setInsightPage, setWorkPage])

  const workSlice = useMemo(
    () => filteredTopWork.slice(workStart, workEnd),
    [filteredTopWork, workEnd, workStart],
  )
  const insightSlice = useMemo(
    () => filteredTopInsights.slice(insightStart, insightEnd),
    [filteredTopInsights, insightEnd, insightStart],
  )
  const tabScrollClass = 'max-h-[min(55vh,28rem)] overflow-x-auto overflow-y-auto rounded-md border border-white/10'

  return (
    <AdminPageShell
      title="Visitors"
      description="Analytics overview (use the range filter to focus)."
      right={
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger className="min-w-40 border-white/15 bg-white/5 text-white">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#101011] text-white">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="grid grid-cols-1 gap-8">
        <AdminListFilters
          query={query}
          onQueryChange={setQuery}
          queryPlaceholder="Search viewed pages..."
          sortValue={sortBy}
          onSortChange={(value) => setSortBy(value as 'views-desc' | 'views-asc' | 'title-asc')}
          sortOptions={[
            { value: 'views-desc', label: 'Views (high-low)' },
            { value: 'views-asc', label: 'Views (low-high)' },
            { value: 'title-asc', label: 'Title (A-Z)' },
          ]}
          className="mb-0"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-xs font-medium text-white/60">Total views</p>
            <p className="mt-2 text-3xl font-bold text-white">{rangeViewRows.length}</p>
          </Card>
          <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-xs font-medium text-white/60">Work views</p>
            <p className="mt-2 text-3xl font-bold text-white">{workViews.length}</p>
          </Card>
          <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-xs font-medium text-white/60">Insight views</p>
            <p className="mt-2 text-3xl font-bold text-white">{insightViews.length}</p>
          </Card>
        </div>

        <Tabs defaultValue="work" className="w-full gap-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <TabsList className="mb-4 grid h-auto w-full grid-cols-1 gap-2 border border-white/10 bg-background/20 p-1.5 sm:grid-cols-2">
              <TabsTrigger
                value="work"
                className="text-white/85 data-[state=active]:bg-white/15 data-[state=active]:text-white"
              >
                <span>Work</span>
                <span className="ml-1.5 text-xs font-normal text-white/50">({filteredTopWork.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="text-white/85 data-[state=active]:bg-white/15 data-[state=active]:text-white"
              >
                <span>Insights</span>
                <span className="ml-1.5 text-xs font-normal text-white/50">({filteredTopInsights.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="work" className="mt-0 space-y-4">
              <div className={tabScrollClass}>
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="sticky top-0 z-1 bg-[#141416] text-white/70">Work</TableHead>
                      <TableHead className="sticky top-0 z-1 bg-[#141416] text-right text-white/70">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTopWork.length === 0 ? (
                      <TableRow className="border-white/10">
                        <TableCell colSpan={2} className="py-8 text-center text-sm text-white/60">
                          No work views yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      workSlice.map(([id, count]) => (
                        <TableRow key={id} className="border-white/10">
                          <TableCell className="font-medium text-white">
                            <Link
                              href={`/work/${encodeURIComponent(id)}`}
                              className="block line-clamp-2 wrap-break-word hover:underline"
                              title={titles.workById.get(id) ?? id}
                            >
                              {titles.workById.get(id) ?? id}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right text-white/80">{count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredTopWork.length > 0 && workTotalPages > 1 ? (
                <div className="flex justify-center pt-1">
                  <PillPagination
                    currentPage={workPage}
                    totalPages={workTotalPages}
                    onPageChange={setWorkPage}
                  />
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="insights" className="mt-0 space-y-4">
              <div className={tabScrollClass}>
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="sticky top-0 z-1 bg-[#141416] text-white/70">Insight</TableHead>
                      <TableHead className="sticky top-0 z-1 bg-[#141416] text-right text-white/70">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTopInsights.length === 0 ? (
                      <TableRow className="border-white/10">
                        <TableCell colSpan={2} className="py-8 text-center text-sm text-white/60">
                          No insight views yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      insightSlice.map(([id, count]) => (
                        <TableRow key={id} className="border-white/10">
                          <TableCell className="font-medium text-white">
                            <Link
                              href={`/insights/${encodeURIComponent(id)}`}
                              className="block line-clamp-2 wrap-break-word hover:underline"
                              title={titles.insightById.get(id) ?? id}
                            >
                              {titles.insightById.get(id) ?? id}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right text-white/80">{count}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredTopInsights.length > 0 && insightTotalPages > 1 ? (
                <div className="flex justify-center pt-1">
                  <PillPagination
                    currentPage={insightPage}
                    totalPages={insightTotalPages}
                    onPageChange={setInsightPage}
                  />
                </div>
              ) : null}
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </AdminPageShell>
  )
}

