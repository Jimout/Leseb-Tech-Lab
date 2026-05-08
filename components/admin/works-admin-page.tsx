'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { AdminListFilters } from '@/components/admin/admin-list-filters'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog'
import { Button } from '@/components/ui/button'
import { PillPagination } from '@/components/ui/pill-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdminPagination } from '@/hooks/use-admin-pagination'
import { useWorkAdminCollection } from '@/hooks/use-work-admin-collection'
import {
  adminPanelSurfaceClass,
  adminTableHeadClass,
  adminTableTitleLinkClass,
} from '@/lib/admin/admin-layout-classes'
import type { WorkRow } from '@/lib/work-admin-types'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

function twoWords(s: string) {
  const words = s.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 2) return s.trim()
  return `${words.slice(0, 2).join(' ')}…`
}

export function WorksAdminPage() {
  const { items, remove, loading, error } = useWorkAdminCollection()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'title-asc' | 'year-desc' | 'year-asc'>('year-desc')
  const hasSearch = query.trim().length > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        String(it.year).toLowerCase().includes(q) ||
        it.slug.toLowerCase().includes(q) ||
        it.id.toLowerCase().includes(q) ||
        it.publicId.toLowerCase().includes(q),
    )
  }, [items, query])

  const sorted = useMemo(() => {
    const next = [...filtered]
    if (sortBy === 'title-asc') {
      next.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'year-asc') {
      next.sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10))
    } else {
      next.sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10))
    }
    return next
  }, [filtered, sortBy])

  const { page, setPage, totalPages, start, end } = useAdminPagination({ totalItems: sorted.length })

  return (
    <AdminPageShell
      title="Work"
      description="Edit work cards."
      right={
        <Button asChild>
          <Link href="/admin/work/create">Add work</Link>
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
          queryPlaceholder="Search work..."
          sortValue={sortBy}
          onSortChange={(value) => {
            setSortBy(value as 'title-asc' | 'year-desc' | 'year-asc')
            setPage(1)
          }}
          sortOptions={[
            { value: 'year-desc', label: 'Year (newest)' },
            { value: 'year-asc', label: 'Year (oldest)' },
            { value: 'title-asc', label: 'Title (A-Z)' },
          ]}
        />
        <div className="min-w-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className={adminTableHeadClass}>Title</TableHead>
                <TableHead className={cn('hidden sm:table-cell', adminTableHeadClass)}>Year</TableHead>
                <TableHead className={cn('hidden lg:table-cell', adminTableHeadClass)}>Public ID</TableHead>
                <TableHead className={cn('text-right', adminTableHeadClass)}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-white/60">
                    {loading
                      ? 'Loading work items...'
                      : hasSearch
                      ? 'No work items match your search. Try a different keyword.'
                      : 'No work items yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                sorted.slice(start, end).map((it) => (
                  <TableRow key={it.id} className={cn('border-white/10')}>
                    <TableCell className="font-medium text-white lg:text-[15px] xl:text-base 2xl:text-lg">
                      <Link
                        href={`/work/${encodeURIComponent(it.slug)}`}
                        className={adminTableTitleLinkClass}
                        title={it.title}
                      >
                        {twoWords(it.title)}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-white/80 sm:table-cell">
                      {it.year}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-white/70 lg:table-cell">
                      {it.publicId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/admin/work/edit?id=${encodeURIComponent(it.id)}`}>Edit</Link>
                        </Button>
                        <ConfirmDeleteDialog
                          title="Delete work?"
                          description="This removes it from the site."
                          onConfirm={() => {
                            void remove(it.id)
                          }}
                          trigger={
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label="Delete work"
                              title="Delete work"
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
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>
    </AdminPageShell>
  )
}

