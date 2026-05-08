'use client'

import { AdminSidebarPanel } from '@/components/admin/admin-sidebar-panel'
import { adminSidebarAsideClass } from '@/lib/admin/admin-layout-classes'

export { AdminSidebarPanel } from '@/components/admin/admin-sidebar-panel'

export function AdminSidebar() {
  return (
    <aside className={adminSidebarAsideClass}>
      <AdminSidebarPanel />
    </aside>
  )
}
