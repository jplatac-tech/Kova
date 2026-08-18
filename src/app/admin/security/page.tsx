import { AdminSecurityForm } from '../../../components/admin/admin-security-form'
import { AdminHeader, AdminPage } from '../../../components/admin/admin-ui'
import { getConfiguredAdminEmail } from '../../../lib/admin-credentials'

export default async function AdminSecurityPage() {
  const email = await getConfiguredAdminEmail()

  return (
    <AdminPage>
      <AdminHeader
        title="Seguridad"
        description="Cambia el correo y la contraseña del acceso administrador."
      />
      <AdminSecurityForm currentEmail={email} />
    </AdminPage>
  )
}
