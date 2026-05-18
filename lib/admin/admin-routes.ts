/** Browser-facing admin URL prefix (rewrites to `/admin/*` in next.config). */
export const ADMIN_PUBLIC_PATH = '/leseb-admin'

export const ADMIN_LOGIN_PATH = `${ADMIN_PUBLIC_PATH}/login`

export const ADMIN_OVERVIEW_PATH = `${ADMIN_PUBLIC_PATH}/overview`

export function adminPublicPath(segment = ''): string {
  if (!segment) return ADMIN_PUBLIC_PATH
  const normalized = segment.startsWith('/') ? segment.slice(1) : segment
  return `${ADMIN_PUBLIC_PATH}/${normalized}`
}

export function isAdminPublicPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return (
    pathname === ADMIN_PUBLIC_PATH ||
    pathname.startsWith(`${ADMIN_PUBLIC_PATH}/`) ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  )
}

export function isAdminLoginPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return (
    pathname === ADMIN_LOGIN_PATH ||
    pathname.startsWith(`${ADMIN_LOGIN_PATH}/`) ||
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login/')
  )
}

export function safeAdminCallbackUrl(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return ADMIN_OVERVIEW_PATH
  if (!isAdminPublicPath(raw)) return ADMIN_OVERVIEW_PATH
  return raw
}
