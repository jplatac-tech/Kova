'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useAppState } from '../app-state/app-state-provider'
import { formatPrice } from '../../lib/utils'
import { ProductImageGallery } from './product-image-gallery'
import type { CatalogProduct } from '../../lib/store'
import { buildWhatsAppUrl, formatQuickQuoteMessage } from '../../lib/whatsapp'
import { STORE_WHATSAPP } from '../../lib/constants'

export function ProductoDetail({ product }: { product: CatalogProduct }) {
  const { addToCart } = useAppState()
  const [quantity, setQuantity] = useState(1)
  const [phone, setPhone] = useState(STORE_WHATSAPP)
  const availableSizes = product.sizes.filter((size) => size.stock > 0)
  const [selectedSize, setSelectedSize] = useState(
    availableSizes[0]?.label ?? product.sizes[0]?.label ?? '',
  )

  useEffect(() => {
    fetch('/api/store/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.whatsappNumber) setPhone(data.whatsappNumber)
      })
      .catch(() => {})
  }, [])

  const selected = product.sizes.find((size) => size.label === selectedSize)
  const maxQty = selected?.stock ?? 0
  const total = useMemo(
    () => product.price * quantity,
    [product.price, quantity],
  )
  const gallery = product.images.length > 0 ? product.images : ['/brand/kova-logo.jpg']
  const waHref = buildWhatsAppUrl(formatQuickQuoteMessage(product.name), phone)

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm sm:rounded-2xl">
        <div className="relative aspect-[4/5] w-full bg-[var(--surface-muted)]">
          <ProductImageGallery images={gallery} alt={product.name} />
        </div>
      </div>

      <section className="min-w-0 space-y-5 sm:space-y-6">
        <div>
          <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-neutral-800 uppercase">
            {product.brandName}
          </span>
          <h1 className="mt-3 text-xl font-semibold text-neutral-950 sm:mt-4 sm:text-2xl md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base">
            {product.description}
          </p>
          <p className="mt-4 text-2xl font-bold sm:mt-6 sm:text-3xl">
            {formatPrice(product.price)}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-900">Talla</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const disabled = size.stock <= 0
              const active = selectedSize === size.label
              return (
                <button
                  key={size.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedSize(size.label)
                    setQuantity(1)
                  }}
                  className={
                    'min-w-[3rem] rounded-full border px-3 py-2 text-sm font-semibold ' +
                    (active
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-[var(--border)] bg-white text-neutral-800') +
                    (disabled ? ' cursor-not-allowed opacity-40 line-through' : '')
                  }
                >
                  {size.label}
                </button>
              )
            })}
          </div>
          {selected ? (
            <p className="mt-2 text-xs text-neutral-500">
              {selected.stock > 0
                ? `${selected.stock} disponibles`
                : 'Sin existencias'}
            </p>
          ) : null}
        </div>

        <label className="block max-w-[10rem] text-sm font-medium text-neutral-900">
          Cantidad
          <Input
            type="number"
            min={1}
            max={Math.max(1, maxQty)}
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Math.min(
                  Math.max(1, Number(event.target.value) || 1),
                  Math.max(1, maxQty),
                ),
              )
            }
            className="mt-2"
          />
        </label>

        <p className="text-sm text-neutral-600">
          Total:{' '}
          <span className="font-semibold text-neutral-900">{formatPrice(total)}</span>
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2">
          <Button
            type="button"
            className="min-h-[44px] w-full bg-neutral-950 text-white hover:bg-neutral-800 sm:min-h-[48px]"
            disabled={!selectedSize || maxQty <= 0}
            onClick={() => {
              addToCart(
                {
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  size: selectedSize,
                  image: gallery[0],
                  brand: product.brandName,
                },
                quantity,
              )
            }}
          >
            Añadir al carrito
          </Button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary inline-flex min-h-[44px] w-full items-center justify-center text-sm sm:min-h-[48px]"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
