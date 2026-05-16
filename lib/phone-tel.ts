/** Strip formatting for `tel:` links while keeping a leading `+` when present. */
export function toTelHref(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ''
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) return ''
  return hasPlus ? `+${digits}` : digits
}
