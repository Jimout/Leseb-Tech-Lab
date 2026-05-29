import { AdminInsightEditPage } from '@/components/admin/insights/admin-insight-edit-page'

export default async function AdminInsightEditRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AdminInsightEditPage id={id} />
}
