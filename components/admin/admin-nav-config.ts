export type AdminNavItem = { href: string; label: string }
export type AdminNavGroup = { id: string; label: string; items: AdminNavItem[] }

export const DEFAULT_ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'core',
    label: 'Core',
    items: [{ href: '/adminopia/overview', label: 'Overview' }],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { href: '/adminopia/insights', label: 'Insights' },
      { href: '/adminopia/work', label: 'Work' },
    ],
  },
  {
    id: 'site',
    label: 'Site',
    items: [
      { href: '/adminopia/site/hero', label: 'Hero' },
      { href: '/adminopia/site/footer', label: 'Footer' },
      { href: '/adminopia/site/insight-toc', label: 'Insight TOC logo' },
      { href: '/adminopia/site/catalog-filters', label: 'Category filters' },
      { href: '/adminopia/privacy', label: 'Privacy' },
    ],
  },
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { href: '/adminopia/pages/about', label: 'About' },
      { href: '/adminopia/pages/contact', label: 'Contact' },
    ],
  },
  {
    id: 'audience',
    label: 'Audience',
    items: [
      { href: '/adminopia/subscribers', label: 'Subscribers' },
      { href: '/adminopia/visitors', label: 'Visitors' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [{ href: '/adminopia/settings', label: 'Admin credentials' }],
  },
]

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = DEFAULT_ADMIN_NAV_GROUPS
