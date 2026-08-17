import Link from 'next/link'
import { AdminProductsList } from '../../../components/admin/admin-products-list'
import { listProducts } from '../../../lib/store'

export default async function AdminProductsPage() {
  const products = await listProducts()

  return (
    <main className="container py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Precio, marca, imágenes, tallas y existencias.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Añadir producto
        </Link>
      </div>
      <div className="mt-8">
        <AdminProductsList products={products} />
      </div>
    </main>
  )
}
