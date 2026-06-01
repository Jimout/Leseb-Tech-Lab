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
import {
  adminSidebarAccordionItemClass,
  adminSidebarAccordionTriggerClass,
  adminSidebarNavLinkBaseClass,
  adminSidebarPanelClass,
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
  const [groups] = React.useState<AdminNavGroup[]>(DEFAULT_ADMIN_NAV_GROUPS)

  const activeGroups = React.useMemo(() => {
    const path = pathname ?? ''
    return groups
      .filter((g) => g.items.some((i) => path === i.href || path.startsWith(i.href + '/')))
      .map((g) => g.id)
  }, [pathname, groups])

  const [open, setOpen] = React.useState<string[]>(() =>
    activeGroups.length ? activeGroups : ['core', 'content'],
  )

  React.useEffect(() => {
    if (!activeGroups.length) return
    setOpen((prev) => Array.from(new Set([...prev, ...activeGroups])))
  }, [activeGroups])

  return (
    <div className={cn(adminSidebarPanelClass, className)}>
      <AdminSidebarBrand />
      <div className="mt-4 h-px w-full shrink-0 bg-white/10" aria-hidden />
      <nav
        className="mt-4 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
        aria-label="Admin"
      >
        <Accordion
          type="multiple"
          value={open}
          onValueChange={setOpen}
          className="flex flex-col gap-1.5"
        >
          {groups.map((group) => (
            <AccordionItem key={group.id} value={group.id} className={adminSidebarAccordionItemClass}>
              <AccordionTrigger
                indicator="sidebar"
                className={cn(adminSidebarAccordionTriggerClass, 'w-full py-2.5 hover:no-underline')}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="inline-block size-1.5 shrink-0 rounded-full bg-white/25" aria-hidden />
                  <span className="min-w-0 truncate">{group.label}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent variant="sidebar">
                <div className="ml-3 border-l border-white/10 pl-3 pt-0.5">
                  <ul className="flex flex-col gap-1">
                    {group.items.map((item) => {
                      const active = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => onNavigate?.()}
                            className={cn(
                              adminSidebarNavLinkBaseClass,
                              active
                                ? 'bg-accent text-accent-foreground'
                                : 'text-white/80 hover:bg-white/5 hover:text-white',
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>

      <div className="mt-6 shrink-0 border-t border-white/10 pt-4">
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
