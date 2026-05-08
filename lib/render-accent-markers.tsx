import type { ReactNode } from 'react'

import { sectionKickerAccentClass } from '@/lib/section-kicker-classes'

/** Main accent — `globals.css` `--accent` (e.g. charcoal in light, yellow in dark). */
const MAIN_ACCENT_CLASS = 'text-accent'

/**
 * Renders `[[...]]` (second accent / kicker ink) and `{{...}}` (main accent) inline markers.
 * - `[[phrase]]` → `sectionKickerAccentClass` (second accent: yellow in light, accent in dark)
 * - `{{phrase}}` → `text-accent` (main accent token)
 */
export function renderInlineAccentMarkers(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /\[\[(.+?)\]\]|\{\{(.+?)\}\}/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const isSecondAccent = m[0].startsWith('[[')
    const inner = isSecondAccent ? m[1]! : m[2]!
    const className = isSecondAccent ? sectionKickerAccentClass : MAIN_ACCENT_CLASS
    parts.push(
      <span key={`${m.index}-${inner}`} className={className}>
        {inner}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}
