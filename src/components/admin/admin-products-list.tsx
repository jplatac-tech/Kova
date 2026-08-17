'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '../../lib/utils'
import type { CatalogProduct } from '../../lib/store'

export function AdminProductsList({ products }: { products: CatalogProduct[] }) {
  const router = useRouter()

  async function remove(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const stock = product.sizes.reduce((sum, size) => sum + size.stock, 0)
        return (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-neutral-500">
                {product.brandName} · {formatPrice(product.price)} · {stock} uds
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/products/${product.id}`}
                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => void remove(product.id)}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
