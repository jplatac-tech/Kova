import { AdminProductForm } from '../../../../components/admin/admin-product-form'
import { listBrands } from '../../../../lib/store'

export default async function AdminNewProductPage() {
  const brands = await listBrands()
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Nuevo producto</h1>
      {brands.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-600">
          Primero crea una marca en Marcas.
        </p>
      ) : (
        <div className="mt-6 max-w-3xl">
          <AdminProductForm brands={brands} />
        </div>
      )}
    </main>
  )
}
