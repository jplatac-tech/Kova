import { AdminSettingsForm } from '../../../components/admin/admin-settings-form'
import { AdminHeader, AdminPage } from '../../../components/admin/admin-ui'
import { getSettings } from '../../../lib/store'

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return (
    <AdminPage>
      <AdminHeader
        title="Textos de la página"
        description="Cambia el hero, el catálogo, WhatsApp y el pie."
      />
      <AdminSettingsForm settings={settings} />
    </AdminPage>
  )
}
