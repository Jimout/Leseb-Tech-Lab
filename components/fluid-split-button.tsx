'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { typeUiSm } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

const SIZE_STYLES = {
  default: {
    shell: 'gap-3 pl-7 pr-2 py-3 text-xs tracking-[0.18em]',
    iconWrap: 'w-9 h-9',
    icon: 'w-4 h-4',
  },
  sm: {
    shell: 'gap-2.5 pl-5 pr-1.5 py-2.5 text-[11px] tracking-[0.18em]',
    iconWrap: 'w-8 h-8',
    icon: 'w-4 h-4',
  },
  /** Navbar / tight toolbars — between micro and `sm` */
  xs: {
    shell: 'gap-2 pl-4 pr-1.5 py-2 text-[10px] tracking-[0.2em]',
    iconWrap: 'w-7 h-7',
    icon: 'w-3.5 h-3.5',
  },
  /** Navbar contact — slightly larger than `xs` */
  navbar: {
    shell: 'gap-2.5 pl-5 pr-1.5 py-2.5 text-[11px] tracking-[0.18em]',
    iconWrap: 'w-8 h-8',
    icon: 'w-4 h-4',
  },
  /** Mobile nav drawer — padding on outer shell so label/icon share equal vertical inset */
  mobileMenu: {
    shell: 'pl-5 text-[11px] leading-none tracking-[0.18em]',
    outer: 'gap-2.5 py-1.5 pr-1.5',
    iconWrap: 'w-7 h-7 shrink-0',
    icon: 'w-3.5 h-3.5',
  },
} as const

type SizeKey = keyof typeof SIZE_STYLES

type FluidSplitVariant = 'primary' | 'secondary'

type FluidSplitButtonProps = {
  label: React.ReactNode
  className?: string
  /** `primary` = brand teal (default). `secondary` = lemon signal on dark bars. */
  variant?: FluidSplitVariant
  /** `xs` / `navbar` / `mobileMenu` / `sm` for compact UI. Default matches hero CTAs. */
  size?: SizeKey
} & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)
)

const VARIANT_SHELL: Record<
  FluidSplitVariant,
  { shell: string; iconWash: string; focusRing: string }
> = {
  primary: {
    shell: 'bg-primary text-primary-foreground',
    iconWash: 'bg-primary-foreground/10',
    focusRing: 'focus-visible:ring-ring/40',
  },
  secondary: {
    shell: 'bg-secondary text-secondary-foreground',
    iconWash: 'bg-secondary-foreground/10',
    focusRing: 'focus-visible:ring-secondary-foreground/35',
  },
}

const shellBaseClass = cn(
  'group inline-flex items-center rounded-full',
  typeUiSm,
  'transition-transform hover:scale-[1.03] active:scale-[1.01]',
  'outline-none focus-visible:ring-[3px]',
  'disabled:pointer-events-none disabled:opacity-50',
)

function FluidSplitSurface({
  label,
  size,
  variant,
}: {
  label: React.ReactNode
  size: SizeKey
  variant: FluidSplitVariant
}) {
  const s = SIZE_STYLES[size]
  const v = VARIANT_SHELL[variant]
  return (
    <>
      <span className={cn('truncate', s.shell)}>{label}</span>
      <span
        className={cn(
          'grid place-items-center rounded-full transition-transform group-hover:rotate-45',
          v.iconWash,
          s.iconWrap,
        )}
        aria-hidden
      >
        <ArrowUpRight className={cn(s.icon)} />
      </span>
    </>
  )
}

function FluidSplitButton(props: FluidSplitButtonProps) {
  const variant = props.variant ?? 'primary'
  const v = VARIANT_SHELL[variant]
  const size = props.size ?? 'default'
  const outerPad = 'outer' in SIZE_STYLES[size] ? SIZE_STYLES[size].outer : undefined

  if ('href' in props && typeof props.href === 'string') {
    const { label, className, href, size: _size, variant: _v, ...anchorRest } = props
    return (
      <a
        href={href}
        className={cn(shellBaseClass, v.shell, outerPad, v.focusRing, className)}
        {...anchorRest}
      >
        <FluidSplitSurface label={label} size={size} variant={variant} />
      </a>
    )
  }

  const { label, className, type = 'button', size: _size2, variant: _v2, ...buttonRest } = props
  return (
    <button
      type={type}
      className={cn(shellBaseClass, v.shell, outerPad, v.focusRing, className)}
      {...buttonRest}
    >
      <FluidSplitSurface label={label} size={size} variant={variant} />
    </button>
  )
}

export { FluidSplitButton, type FluidSplitButtonProps }
