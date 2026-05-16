import { workDetailMetaLabelClass, workDetailMetaValueClass } from '@/lib/work-detail-typography'
import { cn } from '@/lib/utils'

export type WorkDetailMetaBarProps = {
  location: string
  projectType: string
  year: string
  roles: readonly string[]
  className?: string
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className={workDetailMetaLabelClass}>{label}</p>
      <p className={workDetailMetaValueClass}>{value}</p>
    </div>
  )
}

export function WorkDetailMetaBar({
  location,
  projectType,
  year,
  roles,
  className,
}: WorkDetailMetaBarProps) {
  const roleValue = roles.filter(Boolean).join(', ') || '—'

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-12',
        className,
      )}
    >
      <MetaItem label="Location" value={location} />
      <MetaItem label="Project type" value={projectType} />
      <MetaItem label="Year" value={year} />
      <MetaItem label="Role" value={roleValue} />
    </div>
  )
}
