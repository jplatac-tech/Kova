export { isAdminEmail } from './admin-credentials'

export async function getAdminEmails(): Promise<string[]> {
  const { getConfiguredAdminEmail } = await import('./admin-credentials')
  const email = await getConfiguredAdminEmail()
  return email ? [email] : []
}
