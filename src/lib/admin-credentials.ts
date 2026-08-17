import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { getPrisma, hasDatabaseUrl } from './prisma'

const DEV_EMAIL = 'admin@kova.local'
const DEV_PASSWORD = 'kova-admin'
const ADMIN_ID = 'default'
const ADMIN_AUTH_PATH = join(process.cwd(), 'data', 'admin-auth.json')
const SCRYPT_KEYLEN = 64
const scrypt = promisify(scryptCallback)

type PersistedAdminAuth = {
  email: string
  passwordSalt: string
  passwordHash: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getEnvAdminCredentials() {
  const email =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
    (process.env.NODE_ENV !== 'production' ? DEV_EMAIL : '')
  const password =
    process.env.ADMIN_PASSWORD?.trim() ||
    (process.env.NODE_ENV !== 'production' ? DEV_PASSWORD : '')
  return { email, password }
}

export function getAdminCredentials() {
  return getEnvAdminCredentials()
}

export function isAdminEmail(email: string) {
  const expected = getEnvAdminCredentials().email
  if (!expected) return false
  return normalizeEmail(email) === expected
}

function isDbUnreachable(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const err = error as { code?: string; message?: string }
  if (err.code === 'P1001') return true
  const message = String(err.message ?? '').toLowerCase()
  return (
    message.includes("can't reach database") ||
    message.includes('databasenotreachable') ||
    message.includes('econnrefused') ||
    message.includes('enotfound')
  )
}

async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : randomBytes(16)
  const derivedKey = (await scrypt(password, salt, SCRYPT_KEYLEN)) as Buffer
  return {
    passwordSalt: salt.toString('hex'),
    passwordHash: derivedKey.toString('hex'),
  }
}

async function verifyPassword(
  password: string,
  passwordSalt: string,
  passwordHash: string,
) {
  const hashed = await hashPassword(password, passwordSalt)
  const expected = Buffer.from(passwordHash, 'hex')
  const received = Buffer.from(hashed.passwordHash, 'hex')
  return expected.length === received.length && timingSafeEqual(expected, received)
}

async function readJsonAuth(): Promise<PersistedAdminAuth | null> {
  try {
    const raw = await fs.readFile(ADMIN_AUTH_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<PersistedAdminAuth>
    if (!parsed.email || !parsed.passwordSalt || !parsed.passwordHash) return null
    return {
      email: normalizeEmail(parsed.email),
      passwordSalt: parsed.passwordSalt,
      passwordHash: parsed.passwordHash,
    }
  } catch (error) {
    const e = error as NodeJS.ErrnoException
    if (e.code === 'ENOENT') return null
    throw error
  }
}

async function writeJsonAuth(auth: PersistedAdminAuth) {
  await fs.mkdir(join(process.cwd(), 'data'), { recursive: true })
  await fs.writeFile(ADMIN_AUTH_PATH, JSON.stringify(auth, null, 2), 'utf-8')
}

async function readPersistedAuth(): Promise<PersistedAdminAuth | null> {
  if (hasDatabaseUrl()) {
    const prisma = getPrisma()
    if (prisma) {
      const row = await prisma.adminCredential.findUnique({
        where: { id: ADMIN_ID },
      })
      if (row) {
        return {
          email: normalizeEmail(row.email),
          passwordSalt: row.passwordSalt,
          passwordHash: row.passwordHash,
        }
      }
    }
  }
  return readJsonAuth()
}

async function savePersistedAuth(auth: PersistedAdminAuth) {
  if (hasDatabaseUrl()) {
    const prisma = getPrisma()
    if (prisma) {
      try {
        await prisma.adminCredential.upsert({
          where: { id: ADMIN_ID },
          create: { id: ADMIN_ID, ...auth },
          update: auth,
        })
        return
      } catch (error) {
        if (isDbUnreachable(error) && process.env.NODE_ENV !== 'production') {
          await writeJsonAuth(auth)
          return
        }
        throw error
      }
    }
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'No se encontró base de datos para guardar credenciales admin en producción.',
    )
  }
  await writeJsonAuth(auth)
}

export async function getConfiguredAdminEmail() {
  try {
    const persisted = await readPersistedAuth()
    if (persisted?.email) return persisted.email
  } catch (error) {
    if (!isDbUnreachable(error)) throw error
  }
  return getEnvAdminCredentials().email
}

export async function verifyAdminPassword(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail || !password) return false

  try {
    const persisted = await readPersistedAuth()
    if (persisted) {
      if (normalizedEmail !== persisted.email) return false
      return verifyPassword(password, persisted.passwordSalt, persisted.passwordHash)
    }
  } catch (error) {
    if (!isDbUnreachable(error)) throw error
  }

  const env = getEnvAdminCredentials()
  if (!env.email || !env.password) return false
  return normalizedEmail === env.email && password === env.password
}

export async function updateAdminCredentials(input: {
  email?: string
  password?: string
}) {
  const persisted = await readPersistedAuth()
  const env = getEnvAdminCredentials()
  const baseEmail = persisted?.email || env.email
  if (!baseEmail) {
    throw new Error('No hay email admin base configurado')
  }

  const nextEmail = input.email ? normalizeEmail(input.email) : baseEmail
  if (!nextEmail || !nextEmail.includes('@')) {
    throw new Error('El correo admin no es válido')
  }

  const nextPassword = input.password?.trim()
  let passwordSalt: string
  let passwordHash: string

  if (nextPassword) {
    if (nextPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres')
    }
    const hashed = await hashPassword(nextPassword)
    passwordSalt = hashed.passwordSalt
    passwordHash = hashed.passwordHash
  } else if (persisted) {
    passwordSalt = persisted.passwordSalt
    passwordHash = persisted.passwordHash
  } else {
    if (!env.password) {
      throw new Error('No hay contraseña admin base para conservar')
    }
    const hashed = await hashPassword(env.password)
    passwordSalt = hashed.passwordSalt
    passwordHash = hashed.passwordHash
  }

  await savePersistedAuth({
    email: nextEmail,
    passwordSalt,
    passwordHash,
  })

  return { email: nextEmail }
}
