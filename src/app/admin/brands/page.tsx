import { AdminBrandsClient } from '../../../components/admin/admin-brands-client'
import { AdminHeader, AdminPage } from '../../../components/admin/admin-ui'
import { listBrands } from '../../../lib/store'

export default async function AdminBrandsPage() {
  const brands = await listBrands()
  return (
    <AdminPage>
      <AdminHeader
        title="Marcas"
        description="Estas marcas aparecen como filtros en el catálogo."
      />
      <AdminBrandsClient brands={brands} />
    </AdminPage>
  )
}
