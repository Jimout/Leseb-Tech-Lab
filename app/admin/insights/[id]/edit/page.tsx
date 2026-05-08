import { AdminInsightEditPage } from '@/components/admin/insights/admin-insight-edit-page'

export default function AdminInsightEditRoute({
  params,
}: {
  params: { id: string }
}) {
  return <AdminInsightEditPage id={params.id} />
}

