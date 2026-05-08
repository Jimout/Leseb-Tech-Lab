'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

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
} as const

type SizeKey = keyof typeof SIZE_STYLES

type FluidSplitButtonProps = {
  label: React.ReactNode
  className?: string
  /** `xs` / `navbar` / `sm` for compact UI. Default matches hero CTAs. */
  size?: SizeKey
} & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)
)

const shellBaseClass = cn(
  'group inline-flex items-center rounded-full',
  'bg-primary text-primary-foreground',
  'font-mono uppercase',
  'transition-transform hover:scale-[1.03] active:scale-[1.01]',
  'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
  'disabled:pointer-events-none disabled:opacity-50',
)

function FluidSplitSurface({ label, size }: { label: React.ReactNode; size: SizeKey }) {
  const s = SIZE_STYLES[size]
  return (
    <>
      <span className={cn('truncate', s.shell)}>{label}</span>
      <span
        className={cn(
          'grid place-items-center rounded-full bg-primary-foreground/10 transition-transform group-hover:rotate-45',
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
  if ('href' in props && typeof props.href === 'string') {
    const { label, className, href, size = 'default', ...anchorRest } = props
    return (
      <a
        href={href}
        className={cn(shellBaseClass, className)}
        {...anchorRest}
      >
        <FluidSplitSurface label={label} size={size} />
      </a>
    )
  }

  const { label, className, type = 'button', size = 'default', ...buttonRest } = props
  return (
    <button type={type} className={cn(shellBaseClass, className)} {...buttonRest}>
      <FluidSplitSurface label={label} size={size} />
    </button>
  )
}

export { FluidSplitButton, type FluidSplitButtonProps }
