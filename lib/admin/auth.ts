export type AdminCredentials = {
  email: string
  password: string
}

const CREDS_KEY = 'nattyopia:admin-creds:v1'
const SESSION_KEY = 'nattyopia:admin-session:v1'

export const DEFAULT_ADMIN_CREDS: AdminCredentials = {
  email: 'admin@nattyopia.com',
  password: 'admin123',
}

export function readAdminCreds(): AdminCredentials {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_CREDS
  try {
    const raw = window.localStorage.getItem(CREDS_KEY)
    if (!raw) return DEFAULT_ADMIN_CREDS
    const parsed = JSON.parse(raw) as Partial<AdminCredentials>
    return {
      email: parsed.email ?? DEFAULT_ADMIN_CREDS.email,
      password: parsed.password ?? DEFAULT_ADMIN_CREDS.password,
    }
  } catch {
    return DEFAULT_ADMIN_CREDS
  }
}

export function writeAdminCreds(next: AdminCredentials) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CREDS_KEY, JSON.stringify(next))
}

export function isAdminAuthed(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SESSION_KEY) === '1'
}

export function adminLogout() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}

export function adminLogin(email: string, password: string): boolean {
  const creds = readAdminCreds()
  const ok = creds.email.trim().toLowerCase() === email.trim().toLowerCase() && creds.password === password
  if (!ok) return false
  window.localStorage.setItem(SESSION_KEY, '1')
  return true
}

