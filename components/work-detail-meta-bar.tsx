import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type WorkDetailMetaBarProps = {
  location: string
  projectType: string
  year: string
  roles: readonly string[]
  /** Same copy as the admin “Description (meta bar)” field (`descriptionNote`, with legacy `body` fallback). */
  description: string
}

function MetaCell({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-h-0 flex-col px-4 py-5 sm:px-5 sm:py-6', className)}>
      <p className="text-left text-[13px] font-semibold leading-tight text-foreground/60 sm:text-sm">{label}</p>
      <div className="mt-2.5 text-left text-[13px] font-light leading-snug text-foreground/60 sm:mt-3 sm:text-sm">
        {children}
      </div>
    </div>
  )
}

export function WorkDetailMetaBar({
  location,
  projectType,
  year,
  roles,
  description,
}: WorkDetailMetaBarProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,2fr)]">
        <MetaCell label="Location:">{location}</MetaCell>
        <MetaCell label="Project Type:">{projectType}</MetaCell>
        <MetaCell label="Year:">{year}</MetaCell>
        <MetaCell label="Role:">
          <ul className="space-y-1">
            {roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </MetaCell>
        <MetaCell label="Description:">
          <p className="text-left leading-snug">{description}</p>
        </MetaCell>
      </div>
    </div>
  )
}
