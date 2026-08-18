import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdminProductForm } from '../../../../components/admin/admin-product-form'
import { AdminHeader, AdminPage } from '../../../../components/admin/admin-ui'
import { getProductById, listBrands } from '../../../../lib/store'

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, brands] = await Promise.all([
    getProductById(id),
    listBrands(),
  ])
  if (!product) notFound()

  return (
    <AdminPage>
      <AdminHeader
        title="Editar producto"
        description={product.name}
        actions={
          <Link href="/admin/products" className="admin-btn admin-btn--secondary">
            Volver
          </Link>
        }
      />
      <AdminProductForm product={product} brands={brands} />
    </AdminPage>
  )
}
