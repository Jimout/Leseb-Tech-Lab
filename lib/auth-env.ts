import { getSiteUrl } from '@/lib/seo/site-config'

function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, '')
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

/** Mirror secret/url across NextAuth v4 and Auth.js v5 env names. */
export function syncAuthEnvAliases(): void {
  const secret =
    process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim()
  if (secret) {
    if (!process.env.NEXTAUTH_SECRET?.trim()) process.env.NEXTAUTH_SECRET = secret
    if (!process.env.AUTH_SECRET?.trim()) process.env.AUTH_SECRET = secret
  }

  const url =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    resolveProductionSiteUrl()
  if (url) {
    const normalized = normalizeSiteUrl(url)
    if (!process.env.NEXTAUTH_URL?.trim()) process.env.NEXTAUTH_URL = normalized
    if (!process.env.AUTH_URL?.trim()) process.env.AUTH_URL = normalized
  }
}

function resolveProductionSiteUrl(): string | null {
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (publicUrl && !publicUrl.includes('localhost')) {
    return normalizeSiteUrl(publicUrl)
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (productionHost) {
    return normalizeSiteUrl(productionHost)
  }

  if (process.env.VERCEL_URL?.trim()) {
    return normalizeSiteUrl(process.env.VERCEL_URL)
  }

  return null
}

/** Ensure NextAuth can resolve the deployment URL on Vercel. */
export function ensureNextAuthRuntimeEnv(): void {
  syncAuthEnvAliases()
  if (process.env.NEXTAUTH_URL?.trim()) return
  const resolved = resolveProductionSiteUrl()
  if (resolved) process.env.NEXTAUTH_URL = resolved
}

export function hasAuthSecret(): boolean {
  return Boolean(
    process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim(),
  )
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim())
}

export type AuthConfigCheck = {
  id: 'secret' | 'database' | 'url'
  label: string
  ok: boolean
}

export function getAuthConfigChecks(): AuthConfigCheck[] {
  ensureNextAuthRuntimeEnv()
  const url = process.env.NEXTAUTH_URL?.trim() ?? ''
  const urlOk = Boolean(url) && !url.includes('localhost')

  return [
    {
      id: 'secret',
      label: 'NEXTAUTH_SECRET (or AUTH_SECRET)',
      ok: hasAuthSecret(),
    },
    {
      id: 'database',
      label: 'DATABASE_URL',
      ok: hasDatabaseUrl(),
    },
    {
      id: 'url',
      label: 'NEXTAUTH_URL / NEXT_PUBLIC_SITE_URL',
      ok: urlOk,
    },
  ]
}

export function isAuthConfiguredForProduction(): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  return getAuthConfigChecks().every((check) => check.ok)
}

export function getAuthConfigProblemMessage(): string | null {
  const missing = getAuthConfigChecks().filter((c) => !c.ok).map((c) => c.label)
  if (missing.length === 0) return null
  return `Add these in Vercel → Project → Settings → Environment Variables (enable Production), then redeploy: ${missing.join(', ')}.`
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration: '', // filled from getAuthConfigProblemMessage()
  AccessDenied: 'Access denied.',
  Verification: 'Sign-in link expired or invalid.',
  OAuthSignin: 'Could not start sign-in. Try again.',
  OAuthCallback: 'Sign-in callback failed. Try again.',
  OAuthCreateAccount: 'Could not create account.',
  EmailCreateAccount: 'Could not create account.',
  Callback: 'Sign-in callback failed. Try again.',
  OAuthAccountNotLinked: 'Account is not linked.',
  EmailSignin: 'Could not send sign-in email.',
  CredentialsSignin: 'Invalid email or password.',
  SessionRequired: 'Please sign in to continue.',
  Default: 'Sign-in failed. Try again.',
}

export function authErrorMessage(code: string | null | undefined): string | null {
  if (!code?.trim()) return null
  if (code === 'Configuration') {
    return (
      getAuthConfigProblemMessage() ??
      'Auth configuration error. Check Vercel environment variables and redeploy.'
    )
  }
  return AUTH_ERROR_MESSAGES[code] ?? AUTH_ERROR_MESSAGES.Default
}
