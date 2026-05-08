import { createHash, randomBytes } from 'crypto'

function tokenPepper() {
  return process.env.TOKEN_PEPPER ?? process.env.NEXTAUTH_SECRET ?? 'dev-newsletter-token-pepper'
}

export function createRawToken() {
  return randomBytes(32).toString('hex')
}

export function hashToken(rawToken: string) {
  return createHash('sha256').update(`${rawToken}:${tokenPepper()}`).digest('hex')
}

export function signUnsubscribeToken(subscriberId: string) {
  const signature = createHash('sha256')
    .update(`unsubscribe:${subscriberId}:${tokenPepper()}`)
    .digest('hex')
  return `${subscriberId}.${signature}`
}

export function verifyUnsubscribeToken(token: string) {
  const idx = token.indexOf('.')
  if (idx <= 0) return null
  const subscriberId = token.slice(0, idx)
  const signature = token.slice(idx + 1)
  const expected = createHash('sha256')
    .update(`unsubscribe:${subscriberId}:${tokenPepper()}`)
    .digest('hex')
  if (signature !== expected) return null
  return subscriberId
}

export function signPreferencesToken(subscriberId: string) {
  const signature = createHash('sha256')
    .update(`preferences:${subscriberId}:${tokenPepper()}`)
    .digest('hex')
  return `${subscriberId}.${signature}`
}

export function verifyPreferencesToken(token: string) {
  const idx = token.indexOf('.')
  if (idx <= 0) return null
  const subscriberId = token.slice(0, idx)
  const signature = token.slice(idx + 1)
  const expected = createHash('sha256')
    .update(`preferences:${subscriberId}:${tokenPepper()}`)
    .digest('hex')
  if (signature !== expected) return null
  return subscriberId
}
