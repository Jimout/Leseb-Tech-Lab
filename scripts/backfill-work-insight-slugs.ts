/**
 * Backfill missing `slug` on Work / Insight from `title` (unique per table).
 * Does not overwrite non-empty slugs.
 *
 * Usage: `npm run db:backfill-slugs`
 * Requires DATABASE_URL and applied migration for `slug` columns.
 */
import 'dotenv/config'

import { prisma } from '@/lib/prisma'
import { generateUniqueSlug, normalizeSlugInput } from '@/lib/slug-service'

async function main() {
  const works = await prisma.work.findMany({ orderBy: { sortOrder: 'asc' } })
  for (const w of works) {
    if (w.slug?.trim()) continue
    const base = normalizeSlugInput(w.title) || 'work'
    const slug = await generateUniqueSlug(base, 'work', w.id)
    await prisma.work.update({ where: { id: w.id }, data: { slug } })
    console.log(`Work ${w.id} → slug ${slug}`)
  }

  const insights = await prisma.insight.findMany({ orderBy: { sortOrder: 'asc' } })
  for (const ins of insights) {
    if (ins.slug?.trim()) continue
    const base = normalizeSlugInput(ins.title) || 'insight'
    const slug = await generateUniqueSlug(base, 'insight', ins.id)
    await prisma.insight.update({
      where: { id: ins.id },
      data: { slug, href: `/insights/${slug}` },
    })
    console.log(`Insight ${ins.id} → slug ${slug}`)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    void prisma.$disconnect()
    process.exit(1)
  })
