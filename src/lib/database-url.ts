const PRISMA_ONLY_PARAMS = [
  'pgbouncer',
  'connection_limit',
  'pool_timeout',
  'socket_timeout',
  'connect_timeout',
  'supa',
]

/**
 * Vercel/Supabase inject POSTGRES_PRISMA_URL with Prisma-engine flags
 * (`pgbouncer=true`, `supa=...`). Prisma 7 talks through `pg`, which forwards
 * unknown query params as startup options and the pooler rejects the connection.
 */
export function sanitizeDatabaseUrl(raw: string) {
  const normalized = raw.trim().replace(/^postgres:\/\//i, 'postgresql://')
  try {
    const url = new URL(normalized)
    for (const key of PRISMA_ONLY_PARAMS) {
      url.searchParams.delete(key)
    }
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require')
    }
    return url.toString()
  } catch {
    return raw.trim()
  }
}

export function getDatabaseUrl() {
  const raw =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    ''
  return raw ? sanitizeDatabaseUrl(raw) : ''
}

export function hasDatabaseUrl() {
  return Boolean(getDatabaseUrl())
}
