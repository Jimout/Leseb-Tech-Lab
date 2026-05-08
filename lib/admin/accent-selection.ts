/**
 * Wraps the trimmed substring at [selectionStart, selectionEnd) with [[ ... ]]
 * without removing other [[...]] markers elsewhere in the string.
 */
export function wrapAccentAtSelection(
  full: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  const lo = Math.min(selectionStart, selectionEnd)
  const hi = Math.max(selectionStart, selectionEnd)
  if (hi <= lo) return full

  const segment = full.slice(lo, hi)
  const trimmed = segment.trim()
  if (!trimmed) return full

  const rel = segment.indexOf(trimmed)
  if (rel < 0) return full

  const innerStart = lo + rel
  const innerEnd = innerStart + trimmed.length

  const before = full.slice(Math.max(0, innerStart - 2), innerStart)
  const after = full.slice(innerEnd, innerEnd + 2)
  if (before === '[[' && after === ']]') return full

  return full.slice(0, innerStart) + '[[' + trimmed + ']]' + full.slice(innerEnd)
}

const MAIN_OPEN = '{{'
const MAIN_CLOSE = '}}'

/**
 * Wraps the trimmed substring with `{{ ... }}` (main accent — `text-accent` / `--accent`).
 */
export function wrapMainAccentAtSelection(
  full: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  const lo = Math.min(selectionStart, selectionEnd)
  const hi = Math.max(selectionStart, selectionEnd)
  if (hi <= lo) return full

  const segment = full.slice(lo, hi)
  const trimmed = segment.trim()
  if (!trimmed) return full

  const rel = segment.indexOf(trimmed)
  if (rel < 0) return full

  const innerStart = lo + rel
  const innerEnd = innerStart + trimmed.length

  const before = full.slice(Math.max(0, innerStart - MAIN_OPEN.length), innerStart)
  const after = full.slice(innerEnd, innerEnd + MAIN_CLOSE.length)
  if (before === MAIN_OPEN && after === MAIN_CLOSE) return full

  return full.slice(0, innerStart) + MAIN_OPEN + trimmed + MAIN_CLOSE + full.slice(innerEnd)
}

/**
 * Adds `{{...}}` around the selection, or removes it if the selection is already wrapped
 * (same toggle behavior as `toggleAccentAtSelection` for `[[...]]`).
 */
export function toggleMainAccentAtSelection(
  full: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  const lo = Math.min(selectionStart, selectionEnd)
  const hi = Math.max(selectionStart, selectionEnd)
  if (hi <= lo) return full

  const segment = full.slice(lo, hi)
  const trimmed = segment.trim()
  if (!trimmed) return full

  const rel = segment.indexOf(trimmed)
  if (rel < 0) return full

  const innerStart = lo + rel
  const innerEnd = innerStart + trimmed.length

  if (
    trimmed.startsWith(MAIN_OPEN) &&
    trimmed.endsWith(MAIN_CLOSE) &&
    trimmed.length >= MAIN_OPEN.length + MAIN_CLOSE.length
  ) {
    const core = trimmed.slice(MAIN_OPEN.length, -MAIN_CLOSE.length)
    return full.slice(0, innerStart) + core + full.slice(innerEnd)
  }

  const before = full.slice(Math.max(0, innerStart - MAIN_OPEN.length), innerStart)
  const after = full.slice(innerEnd, innerEnd + MAIN_CLOSE.length)
  if (before === MAIN_OPEN && after === MAIN_CLOSE) {
    return (
      full.slice(0, innerStart - MAIN_OPEN.length) +
      full.slice(innerStart, innerEnd) +
      full.slice(innerEnd + MAIN_CLOSE.length)
    )
  }

  return wrapMainAccentAtSelection(full, selectionStart, selectionEnd)
}

/**
 * Adds [[...]] around the selection (second accent / kicker ink), or removes it if already wrapped.
 * Renders as `sectionKickerAccentClass` on the site.
 */
export function toggleAccentAtSelection(
  full: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  const lo = Math.min(selectionStart, selectionEnd)
  const hi = Math.max(selectionStart, selectionEnd)
  if (hi <= lo) return full

  const segment = full.slice(lo, hi)
  const trimmed = segment.trim()
  if (!trimmed) return full

  const rel = segment.indexOf(trimmed)
  if (rel < 0) return full

  const innerStart = lo + rel
  const innerEnd = innerStart + trimmed.length

  if (trimmed.startsWith('[[') && trimmed.endsWith(']]') && trimmed.length >= 4) {
    const core = trimmed.slice(2, -2)
    return full.slice(0, innerStart) + core + full.slice(innerEnd)
  }

  const before = full.slice(Math.max(0, innerStart - 2), innerStart)
  const after = full.slice(innerEnd, innerEnd + 2)
  if (before === '[[' && after === ']]') {
    return full.slice(0, innerStart - 2) + full.slice(innerStart, innerEnd) + full.slice(innerEnd + 2)
  }

  return wrapAccentAtSelection(full, selectionStart, selectionEnd)
}
