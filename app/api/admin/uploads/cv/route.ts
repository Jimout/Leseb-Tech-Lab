import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import { extname, join } from 'path'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { isAllowedAdminSession } from '@/lib/admin-guard'
import { authOptions } from '@/lib/auth'

export const runtime = 'nodejs'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx'])
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

function sanitizeFilenameStem(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAllowedAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }
  if (file.size <= 0) {
    return NextResponse.json({ error: 'File is empty' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: 'File is too large (max 10MB)' }, { status: 400 })
  }

  const extension = extname(file.name || '').toLowerCase()
  const mime = (file.type || '').toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(extension) || !ALLOWED_MIME_TYPES.has(mime)) {
    return NextResponse.json({ error: 'Only .pdf, .doc, and .docx files are allowed' }, { status: 400 })
  }

  const stem = sanitizeFilenameStem(file.name || 'cv')
  const uniqueName = `${stem || 'cv'}-${Date.now()}-${randomUUID().slice(0, 8)}${extension}`
  const outputDir = join(process.cwd(), 'public', 'uploads', 'cv')
  const outputPath = join(outputDir, uniqueName)

  try {
    await mkdir(outputDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(outputPath, buffer)
  } catch (error) {
    console.error('POST /api/admin/uploads/cv failed:', error)
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }

  return NextResponse.json({
    url: `/uploads/cv/${uniqueName}`,
  })
}

