'use client'

import * as React from 'react'

import { Container } from '@/components/layout/container'
import type { WorkFilterDefinition } from '@/lib/work-filter-definition'
import { sectionKickerTextClass } from '@/lib/section-kicker-classes'
import { cn } from '@/lib/utils'

const ROW_LEN = 4

const flexRowGap =
  'flex flex-wrap items-end ' +
  'gap-x-10 gap-y-5 sm:gap-x-11 sm:gap-y-5 md:gap-x-12 md:gap-y-5 lg:gap-x-14 lg:gap-y-6 xl:gap-x-16 xl:gap-y-6 ' +
  '2xl:gap-x-24 2xl:gap-y-9 3xl:gap-x-28 3xl:gap-y-10 4xl:gap-x-32 4xl:gap-y-11'

/** Tighter wrap for the `md:hidden` mobile filter list only (desktop uses `flexRowGap`). */
const flexRowGapMobile =
  'flex flex-wrap items-end gap-x-6 gap-y-2.5 sm:gap-x-7 sm:gap-y-3'

/** Filter name: bold; inactive uses muted via button */
const filterLabelClass =
  'inline whitespace-nowrap font-sans font-bold tracking-tight leading-tight antialiased ' +
  'text-[15px] sm:text-base md:text-lg lg:text-xl xl:text-2xl ' +
  '2xl:text-[3rem] 3xl:text-[3.5rem] 4xl:text-[4rem]'

/** Count subscript: semibold, scales with label via em */
const filterCountClass =
  'ms-0.5 align-baseline font-semibold tabular-nums leading-none ' +
  'text-[0.64em] sm:text-[0.66em] md:text-[0.68em] lg:text-[0.7em] xl:text-[0.72em] ' +
  '2xl:text-[0.84em] 3xl:text-[0.86em] 4xl:text-[0.88em]'

function FilterLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={cn(filterLabelClass, active && 'text-foreground')}>
      {label}
    </span>
  )
}

function FilterRowButton({
  item,
  active,
  onSelect,
  className,
}: {
  item: WorkFilterDefinition
  active: boolean
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={active}
      className={cn(
        'w-auto shrink-0 py-0.5 text-left transition-colors duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        !active && 'text-muted-foreground hover:text-foreground/85',
        className,
      )}
    >
      <span className="inline-flex items-baseline gap-x-1.5 sm:gap-x-2">
        <FilterLabel label={item.label} active={active} />
        <sub className={cn(filterCountClass, active && 'text-foreground dark:text-white')}>
          {item.count}
        </sub>
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
  kicker = 'My Works',
  filterTablistAriaLabel = 'Filter projects',
  className,
}: WorkPageFilterBarProps) {
  const row1 = filters.slice(0, ROW_LEN)
  const row2 = filters.slice(ROW_LEN, ROW_LEN * 2)

  const kickerBlock = (
    <div
      className={cn(
        'flex shrink-0 items-center gap-2 pr-1',
        'md:mr-36 lg:mr-44 xl:mr-56',
        // Extra space between kicker (“My Works”) and first filter row (Explore All…).
        '2xl:mr-120 3xl:mr-160 4xl:mr-192',
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-secondary dark:bg-accent" aria-hidden />
      <span className={sectionKickerTextClass}>{kicker}</span>
    </div>
  )

  return (
    <div className={cn('w-full font-sans', className)}>
      <Container className="py-4 sm:py-5 md:py-9 lg:py-10">
        {/* Mobile: kicker + all filters — tighter vertical rhythm (md+ unchanged) */}
        <div className="flex flex-col gap-7 sm:gap-8 md:hidden">
          {kickerBlock}
          <div className={flexRowGapMobile} role="tablist" aria-label="Filter projects">
            {filters.map((item) => (
              <FilterRowButton
                key={item.id}
                item={item}
                active={activeId === item.id}
                onSelect={onActiveIdChange}
              />
            ))}
          </div>
        </div>

        {/* Desktop: two flex rows — no grid; each control is shrink-0 so labels never overlap */}
        <div
          className="hidden md:flex md:flex-col md:gap-y-3 lg:gap-y-4"
          role="tablist"
          aria-label={filterTablistAriaLabel}
        >
          <div className="flex flex-wrap items-end">
            {kickerBlock}
            <div className={cn(flexRowGap, 'min-w-0 flex-1')}>
              {row1.map((item) => (
                <FilterRowButton
                  key={item.id}
                  item={item}
                  active={activeId === item.id}
                  onSelect={onActiveIdChange}
                />
              ))}
            </div>
          </div>
          <div className={flexRowGap}>
            {row2.map((item) => (
              <FilterRowButton
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
