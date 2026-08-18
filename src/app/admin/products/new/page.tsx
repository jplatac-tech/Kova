import Link from 'next/link'
import { AdminProductForm } from '../../../../components/admin/admin-product-form'
import { AdminAlert, AdminHeader, AdminPage } from '../../../../components/admin/admin-ui'
import { listBrands } from '../../../../lib/store'

export default async function AdminNewProductPage() {
  const brands = await listBrands()
  return (
    <AdminPage>
      <AdminHeader
        title="Nuevo producto"
        description="Completa los datos. Las fotos se suben a Supabase."
        actions={
          <Link href="/admin/products" className="admin-btn admin-btn--secondary">
            Volver
          </Link>
        }
      />
      {brands.length === 0 ? (
        <AdminAlert tone="warn">
          Primero crea una marca en{' '}
          <Link href="/admin/brands" className="font-semibold underline">
            Marcas
          </Link>
          .
        </AdminAlert>
      ) : (
        <AdminProductForm brands={brands} />
      )}
    </AdminPage>
  )
}
