import slugify from 'slugify'

export type SlugEntityType = 'work' | 'insight'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Safe to import from client components. */
export function slugifyTitle(title: string): string {
  return slugify(String(title ?? '').trim(), {
    lower: true,
    strict: true,
    trim: true,
  })
}

export function normalizeSlugInput(raw: string): string {
  return slugifyTitle(raw)
}

export function isValidSlugFormat(slug: string): boolean {
  if (!slug || slug.length === 0 || slug.length > 200) return false
  return SLUG_PATTERN.test(slug)
}
