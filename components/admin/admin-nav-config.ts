export type AdminNavItem = { href: string; label: string }
export type AdminNavGroup = { id: string; label: string; items: AdminNavItem[] }

export const DEFAULT_ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'core',
    label: 'Core',
    items: [{ href: '/leseb-admin/overview', label: 'Overview' }],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { href: '/leseb-admin/insights', label: 'Insights' },
      { href: '/leseb-admin/work', label: 'Work' },
    ],
  },
  {
    id: 'site',
    label: 'Site',
    items: [
      { href: '/leseb-admin/site/hero', label: 'Hero' },
      { href: '/leseb-admin/site/footer', label: 'Footer' },
      { href: '/leseb-admin/site/insight-toc', label: 'Insight TOC logo' },
      { href: '/leseb-admin/site/catalog-filters', label: 'Category filters' },
      { href: '/leseb-admin/privacy', label: 'Privacy' },
    ],
  },
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { href: '/leseb-admin/pages/about', label: 'About' },
      { href: '/leseb-admin/pages/contact', label: 'Contact' },
    ],
  },
  {
    id: 'audience',
    label: 'Audience',
    items: [
      { href: '/leseb-admin/subscribers', label: 'Subscribers' },
      { href: '/leseb-admin/visitors', label: 'Visitors' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [{ href: '/leseb-admin/settings', label: 'Admin credentials' }],
  },
]

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = DEFAULT_ADMIN_NAV_GROUPS
