'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '../../lib/utils'
import type { CatalogProduct } from '../../lib/store'
import { ConfirmModal } from '../../components/ui/confirm-modal'
import { AdminEmpty } from './admin-ui'

export function AdminProductsList({ products }: { products: CatalogProduct[] }) {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function remove(id: string) {
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setPendingId(null)
    router.refresh()
  }

  if (products.length === 0) {
    return (
      <div className="admin-card admin-rise">
        <AdminEmpty
          title="Aún no hay productos"
          description="Crea el primero con nombre, marca, fotos y tallas."
          action={
            <Link href="/admin/products/new" className="admin-btn admin-btn--primary mt-3">
              Añadir producto
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="admin-stagger space-y-3">
      {products.map((product) => {
        const stock = product.sizes.reduce((sum, size) => sum + size.stock, 0)
        const cover = product.images[0]
        return (
          <article
            key={product.id}
            className="admin-row admin-rise flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] font-bold tracking-wide text-neutral-400 uppercase">
                    Sin foto
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{product.name}</p>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {product.brandName} · {formatPrice(product.price)} · {stock} uds
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {product.featured ? (
                    <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                      Destacado
                    </span>
                  ) : null}
                  {!product.isActive ? (
                    <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-neutral-600 uppercase">
                      Oculto
                    </span>
                  ) : null}
                  {stock === 0 ? (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-700 uppercase">
                      Agotado
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
              <Link
                href={`/admin/products/${product.id}`}
                className="admin-btn admin-btn--primary"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setPendingId(product.id)}
                className="admin-btn admin-btn--danger"
              >
                Eliminar
              </button>
            </div>
          </article>
        )
      })}
      <ConfirmModal
        open={Boolean(pendingId)}
        title="Eliminar producto"
        description="Se quitará del catálogo. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        tone="danger"
        onConfirm={() => {
          if (pendingId) void remove(pendingId)
        }}
        onCancel={() => setPendingId(null)}
      />
    </div>
  )
}
