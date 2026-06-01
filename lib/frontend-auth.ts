import { readJson, writeJson } from '@/lib/admin/storage'

export const ADMIN_AUTH_KEY = 'admin:auth:v1'
export const ADMIN_SESSION_KEY = 'admin:session'

export type AdminAccount = {
  email: string
  password: string
  name: string
}

export function defaultAdminAccount(): AdminAccount {
  return {
    email: 'admin@leseb.com',
    password: 'admin123',
    name: 'Admin',
  }
}

export function readAdminAccount(): AdminAccount {
  if (typeof window === 'undefined') return defaultAdminAccount()
  return readJson<AdminAccount>(ADMIN_AUTH_KEY) ?? defaultAdminAccount()
}

export function writeAdminAccount(next: AdminAccount) {
  writeJson(ADMIN_AUTH_KEY, next)
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
}

export function loginAdmin(email: string, password: string): boolean {
  const account = readAdminAccount()
  const ok =
    email.trim().toLowerCase() === account.email.trim().toLowerCase() &&
    password === account.password
  if (ok && typeof window !== 'undefined') {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
  }
  return ok
}

export function logoutAdmin() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY)
}
