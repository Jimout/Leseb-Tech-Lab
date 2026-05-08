import { AdminWorkEditPage } from '@/components/admin/work/admin-work-edit-page'

export default function AdminWorkEditRoute({
  params,
}: {
  params: { id: string }
}) {
  return <AdminWorkEditPage id={params.id} />
}

