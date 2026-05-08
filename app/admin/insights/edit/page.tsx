import { AdminInsightEditPage } from '@/components/admin/insights/admin-insight-edit-page'

export default function AdminInsightEditQueryRoute({
  searchParams,
}: {
  searchParams: { id?: string | string[] }
}) {
  const rawId = searchParams.id
  const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
  return <AdminInsightEditPage id={id} />
}
