import 'dotenv/config'

import { v2 as cloudinary } from 'cloudinary'

import { prisma } from '@/lib/prisma'

type Flags = {
  dryRun: boolean
  delete: boolean
}

function parseFlags(argv: string[]): Flags {
  const args = new Set(argv)
  return {
    dryRun: args.has('--dry-run') || !args.has('--delete'),
    delete: args.has('--delete'),
  }
}

function requireEnv(name: 'CLOUDINARY_CLOUD_NAME' | 'CLOUDINARY_API_KEY' | 'CLOUDINARY_API_SECRET') {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function collectPublicIds(value: unknown, out: Set<string>) {
  if (Array.isArray(value)) {
    for (const item of value) collectPublicIds(item, out)
    return
  }
  if (!value || typeof value !== 'object') return
  const row = value as Record<string, unknown>
  if (typeof row.publicId === 'string' && row.publicId.trim()) out.add(row.publicId.trim())
  for (const v of Object.values(row)) collectPublicIds(v, out)
}

async function fetchDbPublicIds(): Promise<Set<string>> {
  const ids = new Set<string>()
  const work = await prisma.$queryRawUnsafe<Array<{ heroMedia: unknown; mediaAssets: unknown }>>(
    `SELECT "heroMedia", "mediaAssets" FROM "Work"`,
  )
  const insight = await prisma.$queryRawUnsafe<Array<{ heroMedia: unknown; mediaAssets: unknown }>>(
    `SELECT "heroMedia", "mediaAssets" FROM "Insight"`,
  )
  const resource = await prisma.$queryRawUnsafe<Array<{ heroMedia: unknown; mediaAssets: unknown }>>(
    `SELECT "heroMedia", "mediaAssets" FROM "Resource"`,
  )
  for (const row of [...work, ...insight, ...resource]) {
    collectPublicIds(row.heroMedia, ids)
    collectPublicIds(row.mediaAssets, ids)
  }
  return ids
}

async function listCloudinaryPublicIds(resourceType: 'image' | 'video'): Promise<string[]> {
  const out: string[] = []
  let nextCursor: string | undefined
  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: resourceType,
      max_results: 500,
      next_cursor: nextCursor,
    })
    for (const item of result.resources ?? []) {
      if (item.public_id) out.push(item.public_id)
    }
    nextCursor = result.next_cursor
  } while (nextCursor)
  return out
}

async function main() {
  const flags = parseFlags(process.argv.slice(2))
  cloudinary.config({
    cloud_name: requireEnv('CLOUDINARY_CLOUD_NAME'),
    api_key: requireEnv('CLOUDINARY_API_KEY'),
    api_secret: requireEnv('CLOUDINARY_API_SECRET'),
    secure: true,
  })

  const dbIds = await fetchDbPublicIds()
  const cloudinaryIds = [
    ...(await listCloudinaryPublicIds('image')),
    ...(await listCloudinaryPublicIds('video')),
  ]
  const orphaned = cloudinaryIds.filter((id) => !dbIds.has(id))
  console.log(`DB publicIds: ${dbIds.size}`)
  console.log(`Cloudinary assets scanned: ${cloudinaryIds.length}`)
  console.log(`Orphaned assets: ${orphaned.length}`)

  for (const id of orphaned.slice(0, 200)) {
    console.log(`ORPHAN ${id}`)
  }

  if (flags.delete && !flags.dryRun) {
    for (const id of orphaned) {
      try {
        await cloudinary.uploader.destroy(id, { invalidate: true })
      } catch {
        try {
          await cloudinary.uploader.destroy(id, { resource_type: 'video', invalidate: true })
        } catch (error) {
          console.error(`Failed to delete ${id}`, error)
        }
      }
    }
    console.log(`Deleted orphaned assets: ${orphaned.length}`)
  } else {
    console.log(`Dry run mode: ${flags.dryRun}`)
  }
}

main()
  .catch((error) => {
    console.error('Cloudinary orphan scan failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
