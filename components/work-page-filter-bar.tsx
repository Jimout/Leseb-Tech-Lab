'use client'

import * as React from 'react'

import { Container } from '@/components/layout/container'
import type { WorkFilterDefinition } from '@/lib/work-filter-definition'
import {
  catalogFilterCountActiveClass,
  catalogFilterCountClass,
  catalogFilterPillActiveClass,
  catalogFilterPillInactiveClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

function CatalogFilterPill({
  item,
  active,
  onSelect,
}: {
  item: WorkFilterDefinition
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={active}
      className={active ? catalogFilterPillActiveClass : catalogFilterPillInactiveClass}
    >
      <span>{item.label}</span>
      <span className={active ? catalogFilterCountActiveClass : catalogFilterCountClass} aria-hidden>
        {item.count}
      </span>
    </button>
  )
}

export type WorkPageFilterBarProps = {
  filters: readonly WorkFilterDefinition[]
  activeId: string
  onActiveIdChange: (id: string) => void
  kicker?: string
  /** `role="tablist"` label — e.g. "Filter insights" on `/insights`. */
  filterTablistAriaLabel?: string
  className?: string
}

export function WorkPageFilterBar({
  filters,
  activeId,
  onActiveIdChange,
  kicker = 'Our work',
  filterTablistAriaLabel = 'Filter projects',
  className,
}: WorkPageFilterBarProps) {
  return (
    <div
      className={cn('w-full border-b border-border/80 bg-background', className)}
      data-nav-surface="dark"
    >
      <Container className="py-6 sm:py-8 md:py-10 lg:py-11">
        <div className="flex flex-col gap-5 sm:gap-6">
          <div className={landingSectionKickerClass}>
            <span className={landingSectionKickerDotClass} aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {kicker}
            </span>
          </div>

          <div
            className="flex flex-wrap gap-2 sm:gap-2.5"
            role="tablist"
            aria-label={filterTablistAriaLabel}
          >
            {filters.map((item) => (
              <CatalogFilterPill
                key={item.id}
                item={item}
                active={activeId === item.id}
                onSelect={onActiveIdChange}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
