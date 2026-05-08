/**
 * Privacy policy body is stored as either:
 * - Legacy plain text (one visual paragraph per line; blank line = spacing)
 * - Admin rich-text HTML from TipTap (`AdminRichTextEditor`)
 */

function escapeHtmlLine(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** True when stored body appears to be HTML from the rich text editor (or migrated markup). */
export function privacyBodyLooksLikeHtml(body: string): boolean {
  const t = body.trim()
  if (!t.startsWith('<')) return false
  return /<(p|ul|ol|div|br|span|strong|em|u)\b/i.test(t)
}

/** Convert legacy newline-separated copy into paragraphs for TipTap. */
export function privacyPlainTextToHtml(body: string): string {
  const lines = body.split('\n')
  const parts: string[] = []
  for (const line of lines) {
    if (line.trim() === '') {
      parts.push('<p><br /></p>')
    } else {
      parts.push(`<p>${escapeHtmlLine(line)}</p>`)
    }
  }
  const html = parts.join('')
  return html || '<p></p>'
}

/** Value passed into `AdminRichTextEditor` — legacy plain text becomes HTML once in the editor. */
export function privacyBodyToEditorHtml(body: string): string {
  const t = body.trim()
  if (!t) return '<p></p>'
  if (privacyBodyLooksLikeHtml(body)) return body
  return privacyPlainTextToHtml(body)
}
