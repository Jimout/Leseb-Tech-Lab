/**
 * True when HTML has no visible text (e.g. empty `<p></p>`).
 */
export function isInsightHtmlEmpty(html: string | undefined) {
  if (!html) return true
  return html.replace(/<[^>]+>/g, '').trim().length === 0
}

/**
 * SSR-safe HTML cleanup for trusted admin-authored insight HTML.
 * Strips scripts, frames, inline event handlers, and presentation attributes.
 * This keeps typography/colors theme-driven instead of content-hardcoded.
 */
export function sanitizeInsightHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\s(on\w+|javascript:)\s*=/gi, ' data-stripped=')
    .replace(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi, '')
    .replace(/\sclass\s*=\s*("([^"]*)"|'([^']*)')/gi, '')
    .replace(/\scolor\s*=\s*("([^"]*)"|'([^']*)')/gi, '')
    .replace(/<\/?font\b[^>]*>/gi, '')
}
