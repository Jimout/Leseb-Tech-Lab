import { createHmac, timingSafeEqual } from 'node:crypto'

import { decodeSessionHeaderPayload, type SessionHeaderPayload, type SessionHeaderUser } from '@/lib/session-header-shared'

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8
const SESSION_SECRET =
  process.env.SESSION_HEADER_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  'local-dev-session-secret'

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function signPayload(encodedPayload: string): string {
  return createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url')
}

export function encodeSessionHeader(user: SessionHeaderUser): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: SessionHeaderPayload = {
    user,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  }

  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = signPayload(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifyAndDecodeSessionHeader(token: string): SessionHeaderPayload | null {
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null

  const expectedSignature = signPayload(encodedPayload)
  const providedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (providedBuffer.length !== expectedBuffer.length) return null
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return null

  const payload = decodeSessionHeaderPayload(token)
  if (!payload) return null

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp <= now) return null

  return payload
}
