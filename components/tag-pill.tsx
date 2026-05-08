import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const tagPillBaseClass = cn(
  'inline-flex max-w-full items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium tracking-tight transition-colors sm:px-3.5 sm:py-2 sm:text-[13px]',
)

const variants = {
  /** System accent: yellow fill, dark label */
  accent:
    'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
  /** Inactive resource filter: outline on dark grid */
  filterIdle:
    'border border-foreground/45 bg-transparent text-foreground shadow-none hover:border-foreground/70 hover:bg-foreground/5',
  outline: 'border border-border/60 bg-transparent text-foreground hover:bg-foreground/5',
  muted: 'bg-muted text-muted-foreground hover:bg-muted/80',
} as const

export type TagPillVariant = keyof typeof variants

export function tagPillVariantClass(variant: TagPillVariant): string {
  return variants[variant]
}

export type TagPillProps = {
  children: ReactNode
  className?: string
  variant?: TagPillVariant
}

export function TagPill({ children, className, variant = 'accent' }: TagPillProps) {
  return (
    <span className={cn(tagPillBaseClass, variants[variant], className)}>
      {children}
    </span>
  )
}
