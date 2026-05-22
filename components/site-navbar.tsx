'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { SITE_BRAND_NAME, SITE_NAV_LOGO_SRC } from '@/lib/site-brand'
import { NavbarMobileMenuPanel, NavbarMobileMenuTrigger } from '@/components/navbar-mobile-menu'
import { useNavigationUiStore } from '@/stores/use-navigation-ui-store'
import { useNavSurfaceScroll } from '@/hooks/use-nav-surface-scroll'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/services', segment: 'services', label: 'Services' },
  { href: '/work', segment: 'work', label: 'Projects' },
  { href: '/insights', segment: 'insights', label: 'Blog' },
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

function SiteNavbarLogo() {
  return (
    <span className="relative block h-9 w-[8.5rem] shrink-0 sm:h-10 sm:w-[9.5rem] md:h-11 md:w-[10.5rem]">
      <Image
        src={SITE_NAV_LOGO_SRC}
        alt={SITE_BRAND_NAME}
        fill
        className="object-contain object-left"
        sizes="(max-width: 768px) 136px, 168px"
        priority
      />
    </span>
  )
}

export function SiteNavbar({ className, logoHref = '#home' }: SiteNavbarProps) {
  const active = useActiveSegment()
  const { mobileNavOpen, setMobileNavOpen } = useNavigationUiStore()
  const surface = useNavSurfaceScroll()
  const headerRef = React.useRef<HTMLElement>(null)

  // Close mobile nav on mount to clear any stale open state from previous navigation
  React.useEffect(() => {
    setMobileNavOpen(false)
    document.body.style.overflow = ''
  }, [setMobileNavOpen])

  React.useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--site-nav-header-height',
        `${el.getBoundingClientRect().height}px`,
      )
    }

    syncHeaderHeight()
    const observer = new ResizeObserver(syncHeaderHeight)
    observer.observe(el)
    window.addEventListener('resize', syncHeaderHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncHeaderHeight)
    }
  }, [])

  const logoClass = cn(
    'inline-flex items-center rounded-full px-2 py-1.5 sm:px-2.5',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    surface === 'dark'
      ? 'focus-visible:ring-white focus-visible:ring-offset-background'
      : 'focus-visible:ring-offset-background',
  )

  return (
    <header
      ref={headerRef}
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
            'relative isolate flex items-center justify-between gap-3 px-3 py-2',
            'rounded-xl border border-white/10 md:rounded-2xl',
            'bg-background/40 text-white backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]',
            mobileNavOpen && 'max-md:bg-muted max-md:backdrop-blur-none',
          )}
        >
          {logoHref.startsWith('/') ? (
            <Link
              href={logoHref}
              className={cn(logoClass, 'relative z-10')}
              aria-label={`${SITE_BRAND_NAME} | go to home`}
            >
              <SiteNavbarLogo />
            </Link>
          ) : (
            <a href={logoHref} className={cn(logoClass, 'relative z-10')} aria-label={`${SITE_BRAND_NAME} | go to home`}>
              <SiteNavbarLogo />
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
              variant="secondary"
            />
          </div>

          <div className="relative z-10 flex items-center gap-2 md:hidden">
            <NavbarMobileMenuTrigger open={mobileNavOpen} onOpenChange={setMobileNavOpen} scrolled surface={surface} />
          </div>

          <NavbarMobileMenuPanel items={NAV_ITEMS} activeSegment={active} />
        </div>
      </div>
    </header>
  )
}
