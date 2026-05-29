import { AdminWorkEditPage } from '@/components/admin/work/admin-work-edit-page'

type SearchParams = { id?: string | string[] }

export default async function AdminWorkEditQueryRoute({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolved = await searchParams
  const rawId = resolved.id
  const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
  return <AdminWorkEditPage id={id} />
}
