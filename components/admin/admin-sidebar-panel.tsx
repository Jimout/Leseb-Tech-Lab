'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { DEFAULT_ADMIN_NAV_GROUPS, type AdminNavGroup } from '@/components/admin/admin-nav-config'
import { AdminSidebarBrand } from '@/components/admin/admin-sidebar-brand'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { getSessionHeaderFromStorage } from '@/lib/session-header-client'
import {
  adminPanelSurfaceClass,
  adminSidebarAccordionTriggerClass,
  adminSidebarNavLinkBaseClass,
} from '@/lib/admin/admin-layout-classes'
import { cn } from '@/lib/utils'

export function AdminSidebarPanel({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()
  const { logout } = useAdminAuth()
  const [groups, setGroups] = React.useState<AdminNavGroup[]>(DEFAULT_ADMIN_NAV_GROUPS)

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const sessionHeader = getSessionHeaderFromStorage()
        if (!sessionHeader) return

        const response = await fetch('/api/admin/sidebar-menu', {
          cache: 'no-store',
          headers: { 'x-session': sessionHeader },
        })
        if (!response.ok) return

        const payload = (await response.json()) as { groups?: AdminNavGroup[] }
        if (!cancelled && Array.isArray(payload.groups) && payload.groups.length > 0) {
          setGroups(payload.groups)
        }
      } catch {
        // Keep static fallback when API is unavailable.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const activeGroups = React.useMemo(() => {
    const path = pathname ?? ''
    return groups.filter((g) =>
      g.items.some((i) => path === i.href || path.startsWith(i.href + '/')),
    ).map((g) => g.id)
  }, [pathname, groups])

  const [open, setOpen] = React.useState<string[]>(() =>
    activeGroups.length ? activeGroups : ['core', 'content'],
  )

  React.useEffect(() => {
    if (!activeGroups.length) return
    setOpen((prev) => Array.from(new Set([...prev, ...activeGroups])))
  }, [activeGroups])

  return (
    <div className={cn(adminPanelSurfaceClass, 'min-w-0 h-full flex flex-col', className)}>
      <AdminSidebarBrand />
      <div className="mt-4 h-px w-full bg-white/10" aria-hidden />
      <nav className="mt-4 flex-1 min-h-0 overflow-y-auto overflow-x-hidden lg:overflow-visible" aria-label="Admin">
        <Accordion
          type="multiple"
          value={open}
          onValueChange={setOpen}
          className="space-y-2"
        >
          {groups.map((group) => (
            <AccordionItem
              key={group.id}
              value={group.id}
              className="overflow-hidden rounded-xl border-white/10 bg-transparent px-0"
            >
              <AccordionTrigger className={adminSidebarAccordionTriggerClass}>
                <span className="flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-full bg-white/25" aria-hidden />
                  {group.label}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="ml-3 border-l border-white/10 pl-2">
                  <div className="flex flex-col gap-1">
                    {group.items.map((item) => {
                      const active = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => onNavigate?.()}
                          className={cn(
                            adminSidebarNavLinkBaseClass,
                            active
                              ? 'bg-accent text-accent-foreground'
                              : 'text-white/80 hover:bg-white/5 hover:text-white',
                          )}
                        >
                          {!active ? (
                            <span
                              className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-white/25 opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden
                            />
                          ) : null}
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
      <p
        className={cn(
          'mt-6 leading-relaxed text-white/60',
          'text-xs sm:text-sm lg:text-sm xl:text-sm',
          '2xl:text-base 3xl:text-base 4xl:text-base',
        )}
      >
        Site settings pages save to backend. Some content editors still use browser-local storage.
      </p>

      <div className="mt-6 border-t border-white/10 pt-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            logout()
            onNavigate?.()
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  )
}
