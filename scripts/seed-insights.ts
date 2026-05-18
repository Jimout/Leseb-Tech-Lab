/**
 * Seed the insights catalog from `SHOWCASE_INSIGHTS`.
 *
 * Usage:
 *   npm run db:seed-insights          # only when table is empty / placeholder
 *   npm run db:seed-insights -- --force   # replace all rows with showcase seeds
 */
import 'dotenv/config'

import {
  insightDbNeedsBootstrap,
  replaceInsightsWithShowcaseSeeds,
  seedInsightsFromShowcaseIfNeeded,
} from '@/lib/insights-seed-db'
import { prisma } from '@/lib/prisma'

async function main() {
  const force = process.argv.includes('--force')

  if (force) {
    const count = await replaceInsightsWithShowcaseSeeds()
    console.log(`Replaced insights table with ${count} showcase rows.`)
    return
  }

  const existing = await prisma.insight.findMany({ select: { slug: true } })
  const slugs = existing.map((r) => r.slug.trim()).filter(Boolean)

  if (!insightDbNeedsBootstrap(slugs)) {
    console.log(`Skipped: ${slugs.length} insight(s) already in database. Use --force to replace.`)
    return
  }

  const count = await seedInsightsFromShowcaseIfNeeded()
  console.log(`Seeded ${count} insights from showcase catalog.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
