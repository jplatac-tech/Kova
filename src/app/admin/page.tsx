import Link from 'next/link'
import { listBrands, listProducts, usesDatabase } from '../../lib/store'

export const dynamic = 'force-dynamic'

export default async function AdminHomePage() {
  const [products, brands] = await Promise.all([listProducts(), listBrands()])
  const outOfStock = products.filter(
    (product) => !product.sizes.some((size) => size.stock > 0),
  ).length

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold text-neutral-950">Panel Kova</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Administra productos, marcas, tallas, existencias e imágenes.
        {usesDatabase()
          ? ' Los datos se guardan en Postgres.'
          : ' Ahora mismo se guardan en data/kova-store.json. En Vercel conecta Neon/Postgres.'}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-sm text-neutral-500">Productos</p>
          <p className="mt-2 text-3xl font-semibold">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-sm text-neutral-500">Marcas</p>
          <p className="mt-2 text-3xl font-semibold">{brands.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-sm text-neutral-500">Agotados</p>
          <p className="mt-2 text-3xl font-semibold">{outOfStock}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Añadir producto
        </Link>
        <Link
          href="/admin/brands"
          className="rounded-full border border-neutral-900 px-5 py-2.5 text-sm font-semibold"
        >
          Gestionar marcas
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-full border border-neutral-900 px-5 py-2.5 text-sm font-semibold"
        >
          Editar textos de la página
        </Link>
        <Link
          href="/admin/security"
          className="rounded-full border border-neutral-900 px-5 py-2.5 text-sm font-semibold"
        >
          Credenciales admin
        </Link>
      </div>
    </main>
  )
}
