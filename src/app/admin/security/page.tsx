import { AdminSecurityForm } from '../../../components/admin/admin-security-form'
import { getConfiguredAdminEmail } from '../../../lib/admin-credentials'

export default async function AdminSecurityPage() {
  const email = await getConfiguredAdminEmail()

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Seguridad admin</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Cambia el correo y contraseña del acceso administrador.
      </p>
      <div className="mt-8">
        <AdminSecurityForm currentEmail={email} />
      </div>
    </main>
  )
}
