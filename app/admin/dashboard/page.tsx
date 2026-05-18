import { redirect } from 'next/navigation'

/** Alias — admin home is `/leseb-admin/overview`, not `/leseb-admin/dashboard`. */
export default function AdminDashboardAliasPage() {
  redirect('/leseb-admin/overview')
}
