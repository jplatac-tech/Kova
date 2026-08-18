import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { getDatabaseUrl, hasDatabaseUrl } from './database-url'

export { getDatabaseUrl, hasDatabaseUrl }

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
  pgPool?: Pool
}

function getPool() {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 1,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 10_000,
      ssl: { rejectUnauthorized: false },
    })
  }
  return globalForPrisma.pgPool
}

export function getPrisma(): PrismaClient | null {
  if (!hasDatabaseUrl()) return null
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg(getPool()),
      log: ['error', 'warn'],
    })
  }
  return globalForPrisma.prisma
}

/** @deprecated Usa getPrisma() — puede ser null si no hay DATABASE_URL */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma()
    if (!client) {
      throw new Error(
        'No hay DATABASE_URL. Configura Postgres (Supabase) para producción.',
      )
    }
    return Reflect.get(client, prop)
  },
})
