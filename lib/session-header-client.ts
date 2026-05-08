const SESSION_HEADER_STORAGE_KEY = 'user-session-header'

export function saveSessionHeaderToStorage(headerValue: string) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(SESSION_HEADER_STORAGE_KEY, headerValue)
}

export function getSessionHeaderFromStorage(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(SESSION_HEADER_STORAGE_KEY)
}

export function clearSessionHeaderFromStorage() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(SESSION_HEADER_STORAGE_KEY)
}
