import { redirect } from 'next/navigation'

/** Alias — admin home is `/adminopia/overview`, not `/adminopia/dashboard`. */
export default function AdminDashboardAliasPage() {
  redirect('/adminopia/overview')
}
