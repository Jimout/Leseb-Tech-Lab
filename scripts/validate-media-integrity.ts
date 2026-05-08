import 'dotenv/config'

import { prisma } from '@/lib/prisma'
import { sanitizeEmbed360Url, type MediaAsset } from '@/lib/media-assets'

type Flags = {
  dryRun: boolean
  fix: boolean
}

type Finding = {
  severity: 'warning' | 'error'
  table: 'Work' | 'Insight' | 'Resource'
  id: string
  slug: string
  issue: string
}

function parseFlags(argv: string[]): Flags {
  const args = new Set(argv)
  return {
    dryRun: args.has('--dry-run') || !args.has('--fix'),
    fix: args.has('--fix'),
  }
}

function isMediaType(value: unknown): value is MediaAsset['type'] {
  return value === 'image' || value === 'video' || value === 'gif' || value === 'embed360'
}

function normalizeAsset(asset: unknown): MediaAsset | null {
  if (!asset || typeof asset !== 'object') return null
  const row = asset as Record<string, unknown>
  if (!isMediaType(row.type)) return null
  const url = typeof row.url === 'string' ? row.url.trim() : ''
  const embedUrl = typeof row.embedUrl === 'string' ? row.embedUrl.trim() : undefined
  if (row.type === 'embed360') {
    const safe = sanitizeEmbed360Url(embedUrl || url)
    if (!safe) return null
    return {
      type: 'embed360',
      url: safe,
      embedUrl: safe,
      alt: typeof row.alt === 'string' ? row.alt.trim() || undefined : undefined,
      publicId: typeof row.publicId === 'string' ? row.publicId.trim() || undefined : undefined,
    }
  }
  if (!url) return null
  return {
    type: row.type,
    url,
    publicId: typeof row.publicId === 'string' ? row.publicId.trim() || undefined : undefined,
    thumbnailUrl: typeof row.thumbnailUrl === 'string' ? row.thumbnailUrl.trim() || undefined : undefined,
    alt: typeof row.alt === 'string' ? row.alt.trim() || undefined : undefined,
    width: typeof row.width === 'number' ? row.width : undefined,
    height: typeof row.height === 'number' ? row.height : undefined,
    duration: typeof row.duration === 'number' ? row.duration : undefined,
  }
}

function normalizeGallery(value: unknown): MediaAsset[] {
  if (!Array.isArray(value)) return []
  return value.map(normalizeAsset).filter((x): x is MediaAsset => Boolean(x))
}

async function validateTable(
  table: 'Work' | 'Insight' | 'Resource',
  flags: Flags,
  findings: Finding[],
  publicIds: Map<string, string[]>,
) {
  const rows = await prisma.$queryRawUnsafe<Array<{ id: string; slug: string; heroMedia: unknown; mediaAssets: unknown }>>(
    `SELECT id, slug, "heroMedia", "mediaAssets" FROM "${table}"`,
  )

  for (const row of rows) {
    const hero = normalizeAsset(row.heroMedia)
    const gallery = normalizeGallery(row.mediaAssets)

    if (!hero) {
      findings.push({ severity: 'error', table, id: row.id, slug: row.slug, issue: 'Invalid or missing heroMedia.' })
    }
    if (!Array.isArray(row.mediaAssets)) {
      findings.push({ severity: 'warning', table, id: row.id, slug: row.slug, issue: 'mediaAssets is not an array.' })
    }
    if (gallery.length === 0) {
      findings.push({ severity: 'warning', table, id: row.id, slug: row.slug, issue: 'mediaAssets is empty.' })
    }
    if (hero && gallery.length > 0 && gallery[0].url !== hero.url) {
      findings.push({
        severity: 'warning',
        table,
        id: row.id,
        slug: row.slug,
        issue: 'heroMedia does not match first gallery item.',
      })
    }

    const seenPerRow = new Set<string>()
    for (const media of [hero, ...gallery].filter((x): x is MediaAsset => Boolean(x))) {
      if (media.url.startsWith('data:image/')) {
        findings.push({ severity: 'error', table, id: row.id, slug: row.slug, issue: 'Contains legacy data:image blob.' })
      }
      if (media.publicId) {
        if (!publicIds.has(media.publicId)) publicIds.set(media.publicId, [])
        publicIds.get(media.publicId)!.push(`${table}:${row.id}`)
        if (seenPerRow.has(media.publicId)) {
          findings.push({
            severity: 'warning',
            table,
            id: row.id,
            slug: row.slug,
            issue: `Duplicate publicId in same row: ${media.publicId}`,
          })
        }
        seenPerRow.add(media.publicId)
      }
    }

    if (flags.fix && !flags.dryRun) {
      const nextHero = hero ?? gallery[0] ?? null
      const nextGallery = nextHero
        ? [nextHero, ...gallery.filter((g) => g.url !== nextHero.url)]
        : gallery
      await prisma.$executeRawUnsafe(
        `UPDATE "${table}" SET "heroMedia"=$2::jsonb, "mediaAssets"=$3::jsonb WHERE id=$1`,
        row.id,
        JSON.stringify(nextHero),
        JSON.stringify(nextGallery),
      )
    }
  }
}

async function validateLegacyColumns(findings: Finding[]) {
  const rows = await prisma.$queryRawUnsafe<Array<{ table_name: string; column_name: string }>>(
    `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_name IN ('Work','Insight','Resource')
      AND column_name IN ('imageSrc', 'imageAlt')
    `,
  )
  for (const row of rows) {
    findings.push({
      severity: 'warning',
      table: row.table_name as 'Work' | 'Insight' | 'Resource',
      id: '-',
      slug: '-',
      issue: `Legacy column still exists: ${row.column_name}`,
    })
  }
}

async function main() {
  const flags = parseFlags(process.argv.slice(2))
  const findings: Finding[] = []
  const publicIds = new Map<string, string[]>()
  await validateTable('Work', flags, findings, publicIds)
  await validateTable('Insight', flags, findings, publicIds)
  await validateTable('Resource', flags, findings, publicIds)
  await validateLegacyColumns(findings)

  for (const [publicId, refs] of publicIds) {
    if (refs.length > 1) {
      findings.push({
        severity: 'warning',
        table: 'Work',
        id: '-',
        slug: '-',
        issue: `publicId reused across records: ${publicId} -> ${refs.join(', ')}`,
      })
    }
  }

  const errors = findings.filter((f) => f.severity === 'error')
  const warnings = findings.filter((f) => f.severity === 'warning')
  for (const item of findings) {
    const prefix = item.severity === 'error' ? 'ERROR' : 'WARN'
    console.log(`${prefix} [${item.table}] id=${item.id} slug=${item.slug} :: ${item.issue}`)
  }
  console.log('---')
  console.log(`Summary: errors=${errors.length}, warnings=${warnings.length}, total=${findings.length}`)
  console.log(`Mode: dryRun=${flags.dryRun}, fix=${flags.fix}`)
  if (errors.length > 0) process.exitCode = 1
}

main()
  .catch((error) => {
    console.error('Validation script failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
