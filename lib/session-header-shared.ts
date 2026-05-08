export type SessionHeaderUser = {
  id: string
  email: string
  name: string | null
}

export type SessionHeaderPayload = {
  user: SessionHeaderUser
  iat: number
  exp: number
}

function decodeBase64UrlJson<T>(encoded: string): T | null {
  try {
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)

    if (typeof atob === 'function') {
      return JSON.parse(atob(padded)) as T
    }

    const fromBuffer = Buffer.from(padded, 'base64').toString('utf8')
    return JSON.parse(fromBuffer) as T
  } catch {
    return null
  }
}

export function decodeSessionHeaderPayload(token: string): SessionHeaderPayload | null {
  const [encodedPayload] = token.split('.')
  if (!encodedPayload) return null

  return decodeBase64UrlJson<SessionHeaderPayload>(encodedPayload)
}
