import { spawnSync } from 'node:child_process'

const runtimeUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING

const pushUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL

if (!runtimeUrl) {
  console.log(
    '[db-prepare] Sin DATABASE_URL — se omite prisma db push (modo JSON local).',
  )
  process.exit(0)
}

if (!pushUrl) {
  console.log('[db-prepare] Sin URL para db push. Se omite.')
  process.exit(0)
}

const envForPush = {
  ...process.env,
  DATABASE_URL: pushUrl,
}

console.log(
  process.env.POSTGRES_URL_NON_POOLING
    ? '[db-prepare] Aplicando esquema Prisma con conexión non-pooling…'
    : '[db-prepare] Aplicando esquema Prisma con DATABASE_URL…',
)
const result = spawnSync(
  'npx',
  ['prisma', 'db', 'push'],
  {
    stdio: 'inherit',
    env: envForPush,
    timeout: 180000,
  },
)

if (result.error?.code === 'ETIMEDOUT') {
  console.error(
    '[db-prepare] Timeout en prisma db push (180s). Revisa la URL de base de datos (usa non-pooling para schema).',
  )
  process.exit(1)
}

process.exit(result.status ?? 1)
