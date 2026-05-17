'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { Button } from '@/components/ui/button'
import { sectionKickerAccentClass } from '@/lib/section-kicker-classes'
import { cn } from '@/lib/utils'
import { useNavigationUiStore } from '@/stores/use-navigation-ui-store'

export type NavbarMobileNavItem = {
  href: string
  segment: string
  label: string
}

const staggerEase = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const iconMorphTransition =
  'origin-center transition-all duration-400 ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none motion-reduce:duration-0'

export function NavbarMobileMenuTrigger({
  open,
  onOpenChange,
  scrolled = false,
  surface = 'light',
}: {
  open: boolean
  onOpenChange: (next: boolean) => void
  scrolled?: boolean
  surface?: 'light' | 'dark'
}) {
  const buttonSizeClass = scrolled ? 'h-9 w-10' : 'size-12'
  const buttonRadiusClass = scrolled ? 'rounded-2xl' : 'rounded-full'
  const innerSizeClass = scrolled ? 'size-8' : 'size-10'
  const iconSizeClass = scrolled ? 'absolute size-5 sm:size-6' : 'absolute size-7 sm:size-8'
  const stroke = scrolled ? 1.35 : 1.5

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-expanded={open}
      aria-controls="mobile-nav-inline"
      aria-label={open ? 'Close menu' : 'Open menu'}
      onClick={() => onOpenChange(!open)}
      className={cn(
        buttonSizeClass,
        'shrink-0 md:hidden',
        buttonRadiusClass,
        'bg-transparent shadow-none ring-0 ring-offset-0',
        surface === 'dark'
          ? 'text-white hover:bg-white/10 hover:text-white active:bg-white/15'
          : 'text-foreground hover:bg-transparent hover:text-foreground active:bg-transparent',
        'dark:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent',
        surface === 'light' && 'dark:hover:text-foreground',
        surface === 'dark' && 'dark:text-white dark:hover:text-white',
        'focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
      )}
    >
      <span className={cn('relative flex items-center justify-center', innerSizeClass)} aria-hidden>
        <Menu
          className={cn(
            iconSizeClass,
            iconMorphTransition,
            !open && 'scale-x-[1.38] sm:scale-x-[1.45]',
            open
              ? 'scale-75 rotate-90 opacity-0 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:opacity-0'
              : 'rotate-0 opacity-100',
          )}
          strokeWidth={stroke}
        />
        <X
          className={cn(
            iconSizeClass,
            iconMorphTransition,
            open
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-60 -rotate-90 opacity-0 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:opacity-0',
          )}
          strokeWidth={stroke}
        />
      </span>
    </Button>
  )
}

export function NavbarMobileMenuPanel({
  items,
  activeSegment,
  logoHref = '#home',
  introText = 'Have a look around…',
  ctaLabel = 'Contact',
  ctaHref = '/contact',
}: {
  items: readonly NavbarMobileNavItem[]
  activeSegment: string
  logoHref?: string
  introText?: string
  ctaLabel?: string
  ctaHref?: string
}) {
  const { mobileNavOpen: open, setMobileNavOpen: onOpenChange } = useNavigationUiStore()
  const pathname = usePathname()

  React.useEffect(() => {
    onOpenChange(false)
  }, [pathname, onOpenChange])

  React.useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => {
      if (mq.matches) document.body.style.overflow = 'hidden'
      else document.body.style.overflow = ''
    }
    sync()
    mq.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      document.body.style.overflow = ''
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 top-14 z-40 md:hidden',
          'bg-background/65',
          'transition-opacity duration-300 motion-reduce:transition-none',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden
        onClick={() => onOpenChange(false)}
      />
      <div
        id="mobile-nav-inline"
        aria-hidden={!open}
        className={cn(
          'absolute left-0 right-0 top-full z-50 md:hidden',
          'pointer-events-none',
          open && 'pointer-events-auto',
          'grid w-full min-w-0 transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none motion-reduce:duration-0',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
      <div className="min-h-0 overflow-hidden">
        <div
          className={cn(
            'border-t border-border/40 bg-background px-1 pb-4 pt-5 sm:px-2 sm:pb-5 sm:pt-6',
            'opacity-0 transition-opacity duration-300 motion-reduce:transition-none',
            open && 'opacity-100',
          )}
        >
          <p
            className={cn(
              'mb-4 flex items-center gap-2 text-sm text-muted-foreground transition-all duration-500 sm:mb-6 sm:gap-2.5',
              staggerEase,
              'translate-y-2 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
              open && 'translate-y-0 opacity-100',
            )}
            style={{ transitionDelay: open ? '40ms' : '0ms' }}
          >
            <span className={sectionKickerAccentClass} aria-hidden>
              •
            </span>
            {introText}
          </p>

          <nav className="flex w-full flex-col gap-0 sm:gap-1" aria-label="Primary">
            {items.map((item, i) => (
              <Link
                key={item.segment}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'block w-full text-left text-6xl font-medium leading-[1.02] tracking-tight transition-all duration-500 sm:text-7xl',
                  staggerEase,
                  'opacity-0',
                  i % 2 === 0 ? 'translate-x-6' : '-translate-x-6',
                  open && 'translate-x-0 opacity-100',
                  'motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                  activeSegment === item.segment ? 'text-accent' : 'text-foreground hover:text-foreground/90',
                )}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <FluidSplitButton
            label={ctaLabel}
            href={ctaHref}
            size="default"
            variant="secondary"
            className={cn(
              'mt-5 w-fit self-start transition-all duration-500 sm:mt-7',
              staggerEase,
              'translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
              open && 'translate-y-0 opacity-100',
            )}
            style={{ transitionDelay: open ? `${80 + items.length * 60 + 40}ms` : '0ms' }}
            onClick={() => onOpenChange(false)}
          />
        </div>
      </div>
    </div>
    </>
  )
}
