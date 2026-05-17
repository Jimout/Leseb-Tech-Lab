import {
  workDetailFactLabelClass,
  workDetailFactValueClass,
} from '@/lib/work-detail-typography'
import { cn } from '@/lib/utils'

export type WorkDetailProjectFactsProps = {
  client?: string
  industry?: string
  duration?: string
  className?: string
}

function FactColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className={workDetailFactLabelClass}>{label}</p>
      <p className={workDetailFactValueClass}>{value}</p>
    </div>
  )
}

export function WorkDetailProjectFacts({
  client,
  industry,
  duration,
  className,
}: WorkDetailProjectFactsProps) {
  const items = [
    { label: 'Client', value: client?.trim() ?? '' },
    { label: 'Industry', value: industry?.trim() ?? '' },
    { label: 'Duration', value: duration?.trim() ?? '' },
  ].filter((item) => item.value)

  if (items.length === 0) return null

  return (
    <div
      className={cn(
        'mt-7 grid grid-cols-1 gap-8 sm:mt-8 sm:grid-cols-3 sm:gap-6 md:mt-9 lg:mt-10',
        className,
      )}
    >
      {items.map((item) => (
        <FactColumn key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  )
}
