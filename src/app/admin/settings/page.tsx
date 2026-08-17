import { AdminSettingsForm } from '../../../components/admin/admin-settings-form'
import { getSettings } from '../../../lib/store'

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Textos de la página</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Cambia el hero, el catálogo y el pie de página.
      </p>
      <div className="mt-8">
        <AdminSettingsForm settings={settings} />
      </div>
    </main>
  )
}
