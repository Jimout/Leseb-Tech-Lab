'use client'

import * as React from 'react'

import type { WorkFilterDefinition } from '@/lib/work-filter-definition'
import {
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { DEFAULT_WORK_CATALOG_FILTER_SEEDS } from '@/lib/works-catalog-seeds'
import { cn } from '@/lib/utils'

export type { WorkFilterDefinition }

/** Placeholder counts for `WorksFilterMenu` fallback only; live pages use computed counts. */
const DEFAULT_WORK_FILTER_MENU_COUNTS: Record<string, number> = {
  all: 25,
  ai: 6,
  software: 10,
  data: 8,
  community: 5,
  research: 4,
}

/** Default labels & counts matching the portfolio filter reference. */
export const DEFAULT_WORK_FILTERS: readonly WorkFilterDefinition[] = DEFAULT_WORK_CATALOG_FILTER_SEEDS.map((f) => ({
  id: f.id,
  label: f.label,
  count: DEFAULT_WORK_FILTER_MENU_COUNTS[f.id] ?? 0,
}))

const ROW_LEN = 4

const MD_COL = [
  'md:col-start-2',
  'md:col-start-3',
  'md:col-start-4',
  'md:col-start-5',
] as const

function FilterCell({
  item,
  active,
  onSelect,
  className,
  showLeadingRule,
}: {
  item: WorkFilterDefinition
  active: boolean
  onSelect: (id: string) => void
  className?: string
  showLeadingRule?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={active}
      className={cn(
        'w-full py-0.5 text-left transition-colors duration-500 ease-[cubic-bezier(0.45,0,0.55,1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-works',
        showLeadingRule && 'border-l border-border/60 pl-3 md:pl-3.5 lg:pl-4',
        className,
      )}
    >
      <span
        className={cn(
          'inline font-sans tracking-tight',
          active
            ? 'text-lg font-bold text-foreground md:text-xl'
            : 'text-base font-normal text-muted-foreground group-hover:text-foreground/80 md:text-lg',
        )}
      >
        {item.label}
        <sub
          className={cn(
            'ml-0.5 align-baseline text-[0.58em] font-normal tabular-nums',
            active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/90',
          )}
        >
          {item.count}
        </sub>
      </span>
    </button>
  )
}

export type WorksFilterMenuProps = {
  filters?: readonly WorkFilterDefinition[]
  activeId: string
  onActiveIdChange: (id: string) => void
  kicker?: string
  className?: string
}

export function WorksFilterMenu({
  filters = DEFAULT_WORK_FILTERS,
  activeId,
  onActiveIdChange,
  kicker = 'Our work',
  className,
}: WorksFilterMenuProps) {
  const row1 = filters.slice(0, ROW_LEN)
  const row2 = filters.slice(ROW_LEN, ROW_LEN * 2)

  return (
    <div className={cn('group bg-surface-works font-sans text-foreground', className)}>
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-5 sm:py-10 md:px-7 md:py-11 lg:px-9">
        {/* Mobile: tight kicker, then 2×4 grid */}
        <div className="flex flex-col gap-4 md:hidden">
          <p className={landingSectionKickerClass}>
            <span className={landingSectionKickerDotClass} aria-hidden />
            {kicker}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            {[...row1, ...row2].map((item) => (
              <FilterCell
                key={item.id}
                item={item}
                active={activeId === item.id}
                onSelect={onActiveIdChange}
              />
            ))}
          </div>
        </div>

        {/* Desktop: kicker + row1 on one line; faint column lines via cell borders */}
        <div className="hidden md:grid md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-x-0 md:gap-y-6 lg:gap-y-7">
          <div className={cn('col-start-1 row-start-1 min-w-0 pr-2 pt-0.5 lg:pr-3', landingSectionKickerClass)}>
            <span className={landingSectionKickerDotClass} aria-hidden />
            {kicker}
          </div>
          {row1.map((item, i) => (
            <FilterCell
              key={item.id}
              item={item}
              active={activeId === item.id}
              onSelect={onActiveIdChange}
              showLeadingRule
              className={cn(MD_COL[i], 'row-start-1')}
            />
          ))}
          {row2.map((item, i) => (
            <FilterCell
              key={item.id}
              item={item}
              active={activeId === item.id}
              onSelect={onActiveIdChange}
              showLeadingRule
              className={cn(MD_COL[i], 'row-start-2')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
