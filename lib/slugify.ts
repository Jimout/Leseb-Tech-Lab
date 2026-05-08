export function slugifyHeading(s: string) {
  const x = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return x || 'section'
}
