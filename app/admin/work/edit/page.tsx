import { AdminWorkEditPage } from '@/components/admin/work/admin-work-edit-page'

export default async function AdminWorkEditQueryRoute({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }> | { id?: string | string[] }
}) {
  // Await searchParams if it's a Promise
  const params = await searchParams
  const rawId = params.id
  const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
  return <AdminWorkEditPage id={id} />
}