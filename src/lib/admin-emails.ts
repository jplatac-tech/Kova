export { isAdminEmail } from './admin-credentials'

export async function getAdminEmails(): Promise<string[]> {
  const { getAdminCredentials } = await import('./admin-credentials')
  const email = getAdminCredentials().email
  return email ? [email] : []
}
