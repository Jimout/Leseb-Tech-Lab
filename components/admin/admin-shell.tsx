'use client'

import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { AdminBrandMark } from '@/components/admin/admin-brand-mark'
import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { AdminSidebar, AdminSidebarPanel } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/toaster'
import {
  adminLoginShellPaddingClass,
  adminMainGridClass,
  adminShellPaddingClass,
  adminShellRootClass,
} from '@/lib/admin/admin-layout-classes'
import { isAdminLoginPath } from '@/lib/admin/admin-routes'
import { releaseRadixOverlays } from '@/lib/admin/release-radix-overlays'
import { cn } from '@/lib/utils'

const LG_MEDIA = '(min-width: 1024px)'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const [isLgUp, setIsLgUp] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(LG_MEDIA).matches
  })
  const isLogin = isAdminLoginPath(pathname)

  React.useEffect(() => {
    releaseRadixOverlays()
  }, [pathname])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia(LG_MEDIA)
    const apply = () => {
      const desktop = mediaQuery.matches
      setIsLgUp(desktop)
      if (desktop) {
        setMobileNavOpen(false)
        releaseRadixOverlays()
      }
    }
    apply()
    mediaQuery.addEventListener('change', apply)
    return () => mediaQuery.removeEventListener('change', apply)
  }, [])

  React.useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (mobileNavOpen) return
    const timer = window.setTimeout(() => releaseRadixOverlays(), 320)
    return () => window.clearTimeout(timer)
  }, [mobileNavOpen])

  const handleMobileNavChange = React.useCallback((open: boolean) => {
    setMobileNavOpen(open)
    if (!open) {
      window.setTimeout(() => releaseRadixOverlays(), 320)
    }
  }, [])

  if (isLogin) {
    return (
      <main className={cn('dark bg-background text-foreground', adminShellRootClass)}>
        <div
          className={cn(
            'mx-auto flex min-h-dvh w-full max-w-full min-w-0 items-center justify-center overflow-x-hidden',
            adminLoginShellPaddingClass,
          )}
        >
          <AdminRouteGuard>{children}</AdminRouteGuard>
        </div>
      </main>
    )
  }

  return (
    <main className={cn('dark bg-background text-foreground', adminShellRootClass)}>
      <AdminRouteGuard>
        <div className={cn('mx-auto flex min-h-dvh w-full max-w-full min-w-0 flex-col', adminShellPaddingClass)}>
          <header
            className={cn(
              'sticky top-0 z-30 mb-6 flex w-full min-w-0 max-w-full items-center gap-3',
              'border-b border-white/10 bg-background/90 py-3 backdrop-blur-md',
              'lg:hidden',
            )}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 shrink-0 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              aria-expanded={mobileNavOpen}
              aria-controls="admin-mobile-nav"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              onClick={() => handleMobileNavChange(!mobileNavOpen)}
            >
              <Menu className="size-6" strokeWidth={2} aria-hidden />
            </Button>

            {!isLgUp ? (
              <Sheet open={mobileNavOpen} onOpenChange={handleMobileNavChange}>
                <SheetContent
                  id="admin-mobile-nav"
                  side="left"
                  className={cn(
                    'flex w-[min(100%,20rem)] max-w-[calc(100vw-1rem)] flex-col gap-0 border-white/10 bg-[#1A1A1B] p-4',
                  )}
                >
                  <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                  <AdminSidebarPanel
                    className="border-0 bg-transparent p-0"
                    onNavigate={() => handleMobileNavChange(false)}
                  />
                </SheetContent>
              </Sheet>
            ) : null}

            <AdminBrandMark logoSize="sm" className="min-w-0" />
          </header>

          <div className={cn(adminMainGridClass, 'min-h-0 min-w-0 flex-1')}>
            <AdminSidebar />
            <div
              data-admin-main-column
              className="min-w-0 w-full max-w-full overflow-x-hidden"
            >
              {children}
            </div>
          </div>
        </div>
        <Toaster />
      </AdminRouteGuard>
    </main>
  )
}
