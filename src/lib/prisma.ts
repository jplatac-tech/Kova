import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

/** Prefer pooler in app; direct host often fails on IPv6-only networks. */
export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    ''
  )
}

export function hasDatabaseUrl() {
  return Boolean(getDatabaseUrl())
}

export function getPrisma(): PrismaClient | null {
  if (!hasDatabaseUrl()) return null
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg(getDatabaseUrl()),
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
