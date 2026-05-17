/** Ensure a user-entered URL is safe to use in `href` (adds https when missing). */
export function normalizeExternalUrl(input: string | undefined | null): string | null {
  const raw = input?.trim()
  if (!raw) return null
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
}
