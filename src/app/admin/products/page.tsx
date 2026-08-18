import Link from 'next/link'
import { AdminProductsList } from '../../../components/admin/admin-products-list'
import { AdminHeader, AdminPage } from '../../../components/admin/admin-ui'
import { listProducts } from '../../../lib/store'

export default async function AdminProductsPage() {
  const products = await listProducts()

  return (
    <AdminPage>
      <AdminHeader
        title="Productos"
        description="Precio, marca, imágenes, tallas y existencias."
        actions={
          <Link href="/admin/products/new" className="admin-btn admin-btn--primary">
            Añadir producto
          </Link>
        }
      />
      <AdminProductsList products={products} />
    </AdminPage>
  )
}
