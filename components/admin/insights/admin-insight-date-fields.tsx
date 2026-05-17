'use client'

import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  buildInsightDateIso,
  formatInsightDisplayDate,
  INSIGHT_MONTH_OPTIONS,
  parseInsightDateIso,
} from '@/lib/admin/insight-form-dates'
import { cn } from '@/lib/utils'

const subLabelClass = 'mb-1.5 block text-xs font-medium leading-none text-white/55'
const inputClass =
  'h-10 w-full border-white/15 bg-background/30 text-white tabular-nums placeholder:text-white/35'
const monthButtonClass =
  'h-10 w-full justify-between border border-white/15 bg-background/30 px-3 text-white hover:bg-white/10'

type AdminInsightDateFieldsProps = {
  dateIso: string
  onDateIsoChange: (iso: string) => void
  labelClassName?: string
}

export function AdminInsightDateFields({
  dateIso,
  onDateIsoChange,
  labelClassName,
}: AdminInsightDateFieldsProps) {
  const [monthOpen, setMonthOpen] = React.useState(false)
  const parts = React.useMemo(() => parseInsightDateIso(dateIso), [dateIso])
  const monthLabel =
    INSIGHT_MONTH_OPTIONS.find((m) => m.value === parts.month)?.label ?? 'Select month'

  const update = (next: Partial<{ year: number; month: string; day: number }>) => {
    onDateIsoChange(buildInsightDateIso({ ...parts, ...next }))
  }

  const displayPreview = formatInsightDisplayDate(
    new Date(`${buildInsightDateIso(parts)}T12:00:00`),
  )

  return (
    <div className="space-y-2">
      <Label className={labelClassName}>Date</Label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[5.5rem_minmax(0,1fr)_6.5rem] sm:items-end">
        <div>
          <Label htmlFor="insight-date-day" className={subLabelClass}>
            Day
          </Label>
          <Input
            id="insight-date-day"
            type="number"
            min={1}
            max={31}
            value={parts.day}
            onChange={(e) => update({ day: Number(e.target.value) })}
            className={inputClass}
          />
        </div>

        <div className="min-w-0">
          <Label className={subLabelClass}>Month</Label>
          <Popover open={monthOpen} onOpenChange={setMonthOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="secondary" className={monthButtonClass}>
                <span className="truncate">{monthLabel}</span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-60" aria-hidden />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="max-h-64 w-[--radix-popover-trigger-width] overflow-y-auto border-white/10 bg-[#101011] p-1"
            >
              {INSIGHT_MONTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    'flex w-full rounded-md px-3 py-2 text-left text-sm text-white transition hover:bg-white/10',
                    parts.month === opt.value && 'bg-white/10',
                  )}
                  onClick={() => {
                    update({ month: opt.value })
                    setMonthOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="insight-date-year" className={subLabelClass}>
            Year
          </Label>
          <Input
            id="insight-date-year"
            type="number"
            min={1970}
            max={2100}
            value={parts.year}
            onChange={(e) => update({ year: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
      </div>
      <p className="text-xs text-white/45">
        Shown as <span className="text-white/70">{displayPreview}</span>
      </p>
    </div>
  )
}
