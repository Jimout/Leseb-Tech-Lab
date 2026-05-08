'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navbarPaddingClass } from '@/components/layout/container'
import { FluidSplitButton } from '@/components/fluid-split-button'
import { SITE_BRAND_NAME } from '@/lib/site-brand'
import { NavbarMobileMenuPanel, NavbarMobileMenuTrigger } from '@/components/navbar-mobile-menu'
import { useNavigationUiStore } from '@/stores/use-navigation-ui-store'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/work', segment: 'work', label: 'Work' },
  { href: '/insights', segment: 'insights', label: 'Insights' },
  { href: '/about', segment: 'about', label: 'About' },
] as const

function useActiveSegment() {
  const pathname = usePathname()
  const [hashSegment, setHashSegment] = React.useState('')

  React.useEffect(() => {
    const read = () => setHashSegment(window.location.hash.replace(/^#/, ''))
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [pathname])

  if (pathname === '/about') return 'about'
  if (pathname === '/contact') return 'contact'
  if (pathname.startsWith('/insights')) return 'insights'
  if (pathname.startsWith('/work')) return 'work'
  if (pathname === '/') return hashSegment || 'home'

  return hashSegment || 'home'
}

const SCROLL_THRESHOLD_PX = 56

function useScrolledPast(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium',
        'text-foreground/80 hover:text-foreground',
        'transition-colors motion-reduce:transition-none',
        active && 'bg-muted text-foreground',
      )}
    >
      {label}
    </Link>
  )
}

export type SiteNavbarProps = {
  className?: string
  /** Logo links here (default #home) */
  logoHref?: string
}

export function SiteNavbar({ className, logoHref = '#home' }: SiteNavbarProps) {
  const active = useActiveSegment()
  const { mobileNavOpen, setMobileNavOpen } = useNavigationUiStore()

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto flex w-full justify-center',
        'font-sans',
        'pt-1 pb-0.5 md:pt-1.5 md:pb-1',
        className,
      )}
    >
      <div
        className={cn(
          'relative w-full',
          navbarPaddingClass,
          'max-w-[1100px]',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between gap-3 px-3 py-2',
            'rounded-full border shadow-sm backdrop-blur-xl',
            'bg-background/70',
            'border-border/60',
          )}
        >
          {logoHref.startsWith('/') ? (
            <Link
              href={logoHref}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-2',
                'font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
              aria-label={`${SITE_BRAND_NAME} — go to home`}
            >
              {SITE_BRAND_NAME}
            </Link>
          ) : (
            <a
              href={logoHref}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-2',
                'font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
              aria-label={`${SITE_BRAND_NAME} — go to home`}
            >
              {SITE_BRAND_NAME}
            </a>
          )}

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.segment} href={item.href} label={item.label} active={active === item.segment} />
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <FluidSplitButton label="Contact" href="/contact" size="navbar" />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <NavbarMobileMenuTrigger open={mobileNavOpen} onOpenChange={setMobileNavOpen} scrolled />
          </div>
        </div>

        <NavbarMobileMenuPanel items={NAV_ITEMS} activeSegment={active} />
      </div>
    </header>
  )
}
