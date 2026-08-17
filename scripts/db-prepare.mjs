import { spawnSync } from 'node:child_process'

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING

if (!url) {
  console.log(
    '[db-prepare] Sin DATABASE_URL — se omite prisma db push (modo JSON local).',
  )
  process.exit(0)
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = url
}

console.log('[db-prepare] Aplicando esquema Prisma a Postgres…')
const result = spawnSync(
  'npx',
  ['prisma', 'db', 'push', '--skip-generate'],
  { stdio: 'inherit', env: process.env },
)
process.exit(result.status ?? 1)
