import { cn } from '@/lib/utils'

export type NattyopiaLetterRole =
  | 'foreground'
  | 'accent'
  | 'accentSoft'
  | 'inverse'
  /** Light mode: main accent (`--accent`, e.g. #171717) */
  | 'brandMain'
  /** Light mode: second accent (`--secondary`, e.g. #ffcc00) */
  | 'brandSecond'

const baseClass: Record<NattyopiaLetterRole, string> = {
  foreground: 'text-foreground',
  accent: 'text-accent',
  accentSoft: 'text-accent/85',
  inverse: 'text-white',
  brandMain: 'text-accent',
  brandSecond: 'text-secondary',
}

/** Hover inverts yellow ↔ white (soft accent → soft foreground). Parent must use `group/brand`. */
const hoverClass: Record<NattyopiaLetterRole, string> = {
  foreground: 'group-hover/brand:text-accent',
  accent: 'group-hover/brand:text-foreground',
  accentSoft: 'group-hover/brand:text-foreground/85',
  inverse: 'group-hover/brand:text-white',
  brandMain: 'group-hover/brand:text-secondary',
  brandSecond: 'group-hover/brand:text-accent',
}

const letterEase =
  'inline-block transition-colors duration-[480ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none'

type NattyopiaHoverLettersProps = {
  word: string
  className?: string
  getLetterRole: (index: number, char: string) => NattyopiaLetterRole
  /** When false, skip per-letter hover tint transitions (touch / coarse pointer). */
  enableHoverTint?: boolean
}

export function NattyopiaHoverLetters({
  word,
  className,
  getLetterRole,
  enableHoverTint = true,
}: NattyopiaHoverLettersProps) {
  return (
    <span className={cn('inline-flex', className)}>
      {Array.from(word).map((ch, i) => {
        const role = getLetterRole(i, ch)
        return (
          <span
            key={`${i}-${ch}`}
            className={cn(enableHoverTint ? letterEase : 'inline-block', baseClass[role], enableHoverTint && hoverClass[role])}
          >
            {ch}
          </span>
        )
      })}
    </span>
  )
}
