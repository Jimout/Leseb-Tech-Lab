'use client'

import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

type SortOption = {
  value: string
  label: string
}

export function AdminListFilters({
  query,
  onQueryChange,
  queryPlaceholder,
  sortValue,
  onSortChange,
  sortOptions,
  className,
}: {
  query: string
  onQueryChange: (value: string) => void
  queryPlaceholder: string
  sortValue: string
  onSortChange: (value: string) => void
  sortOptions: readonly SortOption[]
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <label className="relative block w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/45" aria-hidden />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={queryPlaceholder}
          className="h-10 border-white/15 bg-white/5 pl-9 text-white placeholder:text-white/40"
        />
      </label>

      <div className="w-full sm:w-56">
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="h-10 w-full border-white/15 bg-white/5 text-white">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#101011] text-white">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
