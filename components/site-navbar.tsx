'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { SITE_BRAND_NAME } from '@/lib/site-brand'
import { NavbarMobileMenuPanel, NavbarMobileMenuTrigger } from '@/components/navbar-mobile-menu'
import { useNavigationUiStore } from '@/stores/use-navigation-ui-store'
import { useNavSurfaceScroll } from '@/hooks/use-nav-surface-scroll'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/services', segment: 'services', label: 'Services' },
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
  if (pathname.startsWith('/services')) return 'services'
  if (pathname === '/') return hashSegment || 'home'

  return hashSegment || 'home'
}

function NavLink({
  href,
  label,
  active,
  surface,
}: {
  href: string
  label: string
  active: boolean
  surface: 'light' | 'dark'
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium',
        'transition-colors motion-reduce:transition-none',
        surface === 'dark'
          ? 'text-white/80 hover:text-white'
          : 'text-foreground/80 hover:text-foreground',
        active &&
          cn(
            surface === 'dark' ? 'text-white' : 'text-foreground',
            'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent after:content-[\"\"]',
          ),
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
  const surface = useNavSurfaceScroll()

  const logoClass = cn(
    'inline-flex items-center gap-2 rounded-full px-3 py-2',
    'font-display text-2xl font-semibold tracking-tight md:text-3xl',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    surface === 'dark'
      ? 'text-white focus-visible:ring-white focus-visible:ring-offset-background'
      : 'text-foreground focus-visible:ring-offset-background',
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto flex w-full justify-center',
        'font-sans',
        'pt-1 pb-0.5 md:pt-1.5 md:pb-1',
        className,
      )}
    >
      <div className={cn('relative mx-auto w-full min-w-0', landingPageContentMaxClass, landingPageGutterClass)}>
        <div
          data-site-navbar-track
          className={cn(
            'flex items-center justify-between gap-3 px-3 py-2',
            'rounded-xl border border-white/10 md:rounded-2xl',
            'bg-background/40 text-white backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]',
          )}
        >
          {logoHref.startsWith('/') ? (
            <Link href={logoHref} className={logoClass} aria-label={`${SITE_BRAND_NAME} | go to home`}>
              {SITE_BRAND_NAME}
            </Link>
          ) : (
            <a href={logoHref} className={logoClass} aria-label={`${SITE_BRAND_NAME} | go to home`}>
              {SITE_BRAND_NAME}
            </a>
          )}

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.segment}
                href={item.href}
                label={item.label}
                active={active === item.segment}
                surface={surface}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <FluidSplitButton
              label="Contact"
              href="/contact"
              size="navbar"
              variant={surface === 'dark' ? 'secondary' : 'primary'}
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <NavbarMobileMenuTrigger open={mobileNavOpen} onOpenChange={setMobileNavOpen} scrolled surface={surface} />
          </div>
        </div>

        <NavbarMobileMenuPanel items={NAV_ITEMS} activeSegment={active} />
      </div>
    </header>
  )
}
