import dynamic from 'next/dynamic'

import { AdminLoadingScreen } from '@/components/admin/admin-loading-screen'

const AdminWorkNewPage = dynamic(
  () =>
    import('@/components/admin/work/admin-work-new-page').then((mod) => ({
      default: mod.AdminWorkNewPage,
    })),
  { loading: () => <AdminLoadingScreen message="Loading work editor" /> },
)

export default function AdminWorkNewRoute() {
  return <AdminWorkNewPage />
}
