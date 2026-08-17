import { AdminBrandsClient } from '../../../components/admin/admin-brands-client'
import { listBrands } from '../../../lib/store'

export default async function AdminBrandsPage() {
  const brands = await listBrands()
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Marcas</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Estas marcas aparecen como filtros en el catálogo.
      </p>
      <div className="mt-8">
        <AdminBrandsClient brands={brands} />
      </div>
    </main>
  )
}
