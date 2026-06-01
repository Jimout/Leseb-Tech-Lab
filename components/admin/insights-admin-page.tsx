'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { AdminListFilters } from '@/components/admin/admin-list-filters'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog'
import { Button } from '@/components/ui/button'
import { PillPagination } from '@/components/ui/pill-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useInsightAdminCollection } from '@/hooks/use-insight-admin-collection'
import { useAdminPagination } from '@/hooks/use-admin-pagination'
import {
  adminPanelSurfaceClass,
  adminTableHeadClass,
  adminTableTitleLinkClass,
} from '@/lib/admin/admin-layout-classes'
import type { ShowcaseInsight } from '@/lib/insights-showcase-data'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

type InsightRow = ShowcaseInsight

function twoWords(s: string) {
  const words = s.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 2) return s.trim()
  return `${words.slice(0, 2).join(' ')}…`
}

export function InsightsAdminPage() {
  const { items, remove, loading, error } = useInsightAdminCollection()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc'>('date-desc')
  const hasSearch = query.trim().length > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.date.toLowerCase().includes(q) ||
        it.slug.toLowerCase().includes(q) ||
        it.id.toLowerCase().includes(q) ||
        it.publicId.toLowerCase().includes(q),
    )
  }, [items, query])

  const sorted = useMemo(() => {
    const next = [...filtered]
    if (sortBy === 'title-asc') {
      next.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      next.sort((a, b) => {
        const at = new Date(a.date).getTime()
        const bt = new Date(b.date).getTime()
        const safeA = Number.isNaN(at) ? 0 : at
        const safeB = Number.isNaN(bt) ? 0 : bt
        return sortBy === 'date-asc' ? safeA - safeB : safeB - safeA
      })
    }
    return next
  }, [filtered, sortBy])

  const { page, setPage, totalPages, start, end } = useAdminPagination({ totalItems: sorted.length })

  return (
    <AdminPageShell
      title="Insights"
      description="Create and edit insights stored in this browser."
      right={
        <Button asChild>
          <Link href="/leseb-admin/insights/create">Add insight</Link>
        </Button>
      }
    >
      <div className={adminPanelSurfaceClass}>
        <AdminListFilters
          query={query}
          onQueryChange={(value) => {
            setQuery(value)
            setPage(1)
          }}
          queryPlaceholder="Search insights..."
          sortValue={sortBy}
          onSortChange={(value) => {
            setSortBy(value as 'date-desc' | 'date-asc' | 'title-asc')
            setPage(1)
          }}
          sortOptions={[
            { value: 'date-desc', label: 'Date (newest)' },
            { value: 'date-asc', label: 'Date (oldest)' },
            { value: 'title-asc', label: 'Title (A-Z)' },
          ]}
        />
        <div className="min-w-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className={adminTableHeadClass}>Title</TableHead>
                <TableHead className={cn('hidden sm:table-cell', adminTableHeadClass)}>Date</TableHead>
                <TableHead className={cn('hidden lg:table-cell', adminTableHeadClass)}>Public ID</TableHead>
                <TableHead className={cn('text-right', adminTableHeadClass)}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-white/60">
                    {loading
                      ? 'Loading insights...'
                      : hasSearch
                      ? 'No insights match your search. Try a different keyword.'
                      : 'No insights yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                sorted.slice(start, end).map((it) => (
                  <TableRow key={it.id} className={cn('border-white/10')}>
                    <TableCell className="font-medium text-white lg:text-[15px] xl:text-base 2xl:text-lg">
                      <Link
                        href={`/insights/${encodeURIComponent(it.slug)}`}
                        className={adminTableTitleLinkClass}
                        title={it.title}
                      >
                        {twoWords(it.title)}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-white/80 sm:table-cell">
                      {it.date}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-white/70 lg:table-cell">
                      {it.publicId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/leseb-admin/insights/${encodeURIComponent(it.id)}/edit`}>Edit</Link>
                        </Button>
                        <ConfirmDeleteDialog
                          title="Delete insight?"
                          description="This removes the insight from your saved content."
                          onConfirm={() => {
                            void remove(it.id)
                          }}
                          trigger={
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0 hover:opacity-90"
                              aria-label="Delete insight"
                              title="Delete insight"
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex justify-center sm:mt-8 lg:mt-10">
          <PillPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            hideWhenSinglePage
          />
        </div>
        <p className="mt-4 text-xs text-white/60">
          Changes are saved in this browser and appear on the public site after save.
        </p>
        {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      </div>
    </AdminPageShell>
  )
}

