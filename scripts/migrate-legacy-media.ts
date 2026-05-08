import 'dotenv/config'

import { prisma } from '@/lib/prisma'
import { uploadMediaAsset } from '@/lib/cloudinary'
import type { MediaAsset } from '@/lib/media-assets'

type LegacyRow = {
  id: string
  imageSrc: string | null
  imageAlt: string | null
  heroMedia: unknown
  mediaAssets: unknown
}

type Flags = {
  dryRun: boolean
  uploadBase64: boolean
}

function parseFlags(argv: string[]): Flags {
  const args = new Set(argv)
  return {
    dryRun: args.has('--dry-run') || !args.has('--apply'),
    uploadBase64: args.has('--upload-base64'),
  }
}

function isDataUrl(value: string) {
  return /^data:/i.test(value)
}

function parseDataUrlToBuffer(dataUrl: string): { buffer: Buffer; ext: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return null
  const mime = match[1].toLowerCase()
  const b64 = match[2]
  const ext =
    mime === 'image/png'
      ? 'png'
      : mime === 'image/gif'
        ? 'gif'
        : mime === 'image/webp'
          ? 'webp'
          : mime === 'image/jpeg' || mime === 'image/jpg'
            ? 'jpg'
            : 'bin'
  return { buffer: Buffer.from(b64, 'base64'), ext }
}

function buildAsset(src: string, alt: string | null): MediaAsset {
  return {
    type: src.toLowerCase().endsWith('.gif') ? 'gif' : 'image',
    url: src,
    alt: (alt || '').trim() || undefined,
  }
}

async function migrateTable(table: 'Work' | 'Insight' | 'Resource', flags: Flags) {
  const hasOldColumns = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = $1
        AND column_name = 'imageSrc'
    ) AS "exists"
  `,
    table,
  )
  if (!hasOldColumns[0]?.exists) {
    console.log(`[${table}] skipped: legacy columns not found.`)
    return
  }

  const rows = await prisma.$queryRawUnsafe<LegacyRow[]>(
    `SELECT id, "imageSrc", "imageAlt", "heroMedia", "mediaAssets" FROM "${table}"`,
  )

  let changed = 0
  for (const row of rows) {
    const src = (row.imageSrc || '').trim()
    if (!src) continue

    const existingHero = row.heroMedia && typeof row.heroMedia === 'object'
    const existingGallery = Array.isArray(row.mediaAssets) && row.mediaAssets.length > 0
    if (existingHero && existingGallery) continue

    let asset = buildAsset(src, row.imageAlt)
    if (flags.uploadBase64 && isDataUrl(src)) {
      const parsed = parseDataUrlToBuffer(src)
      if (parsed) {
        try {
          const uploaded = await uploadMediaAsset({
            buffer: parsed.buffer,
            filename: `${table.toLowerCase()}-${row.id}.${parsed.ext}`,
            folder: `${table.toLowerCase()}/migrated`,
            kind: parsed.ext === 'gif' ? 'gif' : 'image',
          })
          asset = {
            ...uploaded,
            alt: asset.alt,
          }
        } catch (error) {
          console.error(`[${table}] base64 upload failed for ${row.id}:`, error)
          continue
        }
      }
    }

    changed += 1
    console.log(`[${table}] ${row.id} -> ${asset.url}`)
    if (flags.dryRun) continue

    await prisma.$executeRawUnsafe(
      `
      UPDATE "${table}"
      SET "heroMedia" = $2::jsonb,
          "mediaAssets" = $3::jsonb
      WHERE id = $1
    `,
      row.id,
      JSON.stringify(asset),
      JSON.stringify([asset]),
    )
  }

  console.log(`[${table}] scanned=${rows.length}, migrated=${changed}, dryRun=${flags.dryRun}`)
}

async function main() {
  const flags = parseFlags(process.argv.slice(2))
  console.log(`Legacy media migration started (dryRun=${flags.dryRun}, uploadBase64=${flags.uploadBase64})`)
  await migrateTable('Work', flags)
  await migrateTable('Insight', flags)
  await migrateTable('Resource', flags)
}

main()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
