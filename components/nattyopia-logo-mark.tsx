import { cn } from '@/lib/utils'

/** Stylized “N” from two geometric marks (accent fill via `text-accent`). */
export function NattyopiaLogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      className={cn('shrink-0 text-accent', className)}
      aria-hidden
    >
      <polygon fill="currentColor" points="8,10 22,10 14,46 8,46" />
      <polygon fill="currentColor" points="22,10 38,10 48,46 32,46" />
    </svg>
  )
}
