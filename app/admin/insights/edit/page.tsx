import { AdminInsightEditPage } from '@/components/admin/insights/admin-insight-edit-page'

type SearchParams = { id?: string | string[] }

export default async function AdminInsightEditQueryRoute({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolved = await searchParams
  const rawId = resolved.id
  const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
  return <AdminInsightEditPage id={id} />
}
