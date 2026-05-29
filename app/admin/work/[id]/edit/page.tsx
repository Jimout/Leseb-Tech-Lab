import { AdminWorkEditPage } from '@/components/admin/work/admin-work-edit-page'

export default async function AdminWorkEditRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AdminWorkEditPage id={id} />
}
