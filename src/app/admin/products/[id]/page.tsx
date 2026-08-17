import { notFound } from 'next/navigation'
import { AdminProductForm } from '../../../../components/admin/admin-product-form'
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
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Editar producto</h1>
      <div className="mt-6 max-w-3xl">
        <AdminProductForm product={product} brands={brands} />
      </div>
    </main>
  )
}
