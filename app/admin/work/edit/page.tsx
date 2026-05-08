import { AdminWorkEditPage } from '@/components/admin/work/admin-work-edit-page'

export default function AdminWorkEditQueryRoute({
  searchParams,
}: {
  searchParams: { id?: string | string[] }
}) {
  const rawId = searchParams.id
  const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
  return <AdminWorkEditPage id={id} />
}
