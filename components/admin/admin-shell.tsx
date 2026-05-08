'use client'

import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { AdminSidebar, AdminSidebarPanel } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/toaster'
import {
  adminLoginShellPaddingClass,
  adminMainGridClass,
  adminShellPaddingClass,
} from '@/lib/admin/admin-layout-classes'
import { cn } from '@/lib/utils'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const isLogin = pathname?.startsWith('/adminopia/login')

  React.useEffect(() => {
    if (typeof document === 'undefined') return
    // Defensive cleanup for rare stale Radix overlays/body-lock after interrupted navigation.
    const staleOverlays = document.querySelectorAll(
      '[data-slot="sheet-overlay"],[data-slot="dialog-overlay"],[data-slot="alert-dialog-overlay"],[data-slot="drawer-overlay"]',
    )
    staleOverlays.forEach((el) => {
      const state = el.getAttribute('data-state')
      if (state === 'closed' || state === null) el.remove()
    })
    document.body.style.pointerEvents = 'auto'
    document.documentElement.style.pointerEvents = 'auto'
    document.body.style.overflow = ''
    document.body.removeAttribute('data-scroll-locked')
  }, [pathname])

  React.useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileNavOpen(false)
    }
    mediaQuery.addEventListener('change', handleChange)
    if (mediaQuery.matches) setMobileNavOpen(false)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (isLogin) {
    return (
      <main className={cn('dark min-h-dvh bg-background text-foreground')}>
        <div
          className={cn(
            'mx-auto flex min-h-dvh w-full max-w-none items-center justify-center',
            adminLoginShellPaddingClass,
          )}
        >
          <AdminRouteGuard>{children}</AdminRouteGuard>
        </div>
      </main>
    )
  }

  return (
    <main className={cn('dark min-h-dvh bg-background text-foreground')}>
      <AdminRouteGuard>
        <div className={cn('mx-auto w-full max-w-none', adminShellPaddingClass, 'min-h-dvh flex flex-col')}>
          <header
            className={cn(
              'sticky top-0 z-30 -mx-6 mb-6 flex items-center gap-3 border-b border-white/10',
              'bg-[#0a0a0b]/90 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-5',
              'lg:hidden',
            )}
          >
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 shrink-0 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                aria-expanded={mobileNavOpen}
                aria-controls="admin-mobile-nav"
                aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileNavOpen((o) => !o)}
              >
                <Menu className="size-6" strokeWidth={2} aria-hidden />
              </Button>
              <SheetContent
                id="admin-mobile-nav"
                side="left"
                className={cn(
                  'flex w-[min(100vw-1.5rem,20rem)] flex-col gap-0 border-white/10 bg-[#1A1A1B] p-4 sm:max-w-[20rem]',
                )}
              >
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <AdminSidebarPanel
                  className="border-0 bg-transparent p-0"
                  onNavigate={() => setMobileNavOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <p className="min-w-0 truncate text-sm font-semibold text-white">
              natty<span className="text-accent">opia</span> space
            </p>
          </header>

          <div className={cn(adminMainGridClass, 'flex-1 min-h-0')}>
            <AdminSidebar />
            <div className="w-full min-w-0">{children}</div>
          </div>
        </div>
        <Toaster />
      </AdminRouteGuard>
    </main>
  )
}

