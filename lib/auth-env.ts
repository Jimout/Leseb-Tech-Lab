import { getSiteUrl } from '@/lib/seo/site-config'

/** Ensure NextAuth can resolve the deployment URL on Vercel. */
export function ensureNextAuthRuntimeEnv(): void {
  if (process.env.NEXTAUTH_URL?.trim()) return
  try {
    const url = getSiteUrl()
    if (url) process.env.NEXTAUTH_URL = url
  } catch {
    // getSiteUrl falls back to localhost when unset
  }
}

export function hasAuthSecret(): boolean {
  return Boolean(
    process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim(),
  )
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    'Auth is not configured on the server. In Vercel, set NEXTAUTH_SECRET, NEXTAUTH_URL, and DATABASE_URL, then redeploy.',
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
  return AUTH_ERROR_MESSAGES[code] ?? AUTH_ERROR_MESSAGES.Default
}
