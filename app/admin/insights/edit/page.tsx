import { AdminInsightEditPage } from '@/components/admin/insights/admin-insight-edit-page'

export default async function AdminInsightEditQueryRoute({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }> | { id?: string | string[] }
}) {
  // Await searchParams if it's a Promise
  const params = await searchParams
  const rawId = params.id
  const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
  return <AdminInsightEditPage id={id} />
}