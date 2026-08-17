const DEV_EMAIL = 'admin@kova.local'
const DEV_PASSWORD = 'kova-admin'

export function getAdminCredentials() {
  const email =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
    (process.env.NODE_ENV !== 'production' ? DEV_EMAIL : '')
  const password =
    process.env.ADMIN_PASSWORD?.trim() ||
    (process.env.NODE_ENV !== 'production' ? DEV_PASSWORD : '')
  return { email, password }
}

export function isAdminEmail(email: string) {
  const expected = getAdminCredentials().email
  if (!expected) return false
  return email.trim().toLowerCase() === expected
}

export function verifyAdminPassword(email: string, password: string) {
  const creds = getAdminCredentials()
  if (!creds.email || !creds.password) return false
  return (
    email.trim().toLowerCase() === creds.email && password === creds.password
  )
}
