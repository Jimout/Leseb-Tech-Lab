import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { PrismaClient } from '@/lib/generated/prisma/client'

/** Dev/webpack sometimes bundles Prisma without the native query engine — point at node_modules. */
function ensurePrismaQueryEngineEnv() {
  if (process.env.PRISMA_QUERY_ENGINE_LIBRARY?.trim()) return
  const engineName =
    process.platform === 'win32'
      ? 'query_engine-windows.dll.node'
      : process.platform === 'darwin'
        ? 'libquery_engine-darwin.dylib.node'
        : 'libquery_engine-debian-openssl-3.0.x.so.node'
  const enginePath = join(process.cwd(), 'node_modules', '@prisma', 'engines', engineName)
  if (existsSync(enginePath)) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath
  }
}

ensurePrismaQueryEngineEnv()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
