'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppState, type CartItem } from '../app-state/app-state-provider'
import { formatCartPrice } from '../../lib/cart-display'
import { CartWhatsAppComposer } from './cart-whatsapp-composer'

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? 'h-4 w-4'}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12h10l1-12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CartLineRow({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem
  onRemove: () => void
  onQuantityChange: (qty: number) => void
}) {
  const lineTotal = item.price * item.quantity

  return (
    <li className="border-b border-[var(--border)] py-6 first:pt-0 sm:py-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 sm:gap-6">
          <div className="w-24 shrink-0 sm:w-32">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-[var(--surface-muted)]">
              <Image
                src={item.image || '/brand/kova-logo.jpg'}
                alt={item.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 96px, 128px"
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">
                {item.name}
              </h2>
              {item.brand ? (
                <p className="mt-1 text-sm text-neutral-600">{item.brand}</p>
              ) : null}
              {item.size ? (
                <p className="mt-2 text-sm text-neutral-800">Talla: {item.size}</p>
              ) : null}
            </div>
            <p className="shrink-0 text-base font-medium text-neutral-900 sm:text-right">
              {formatCartPrice(lineTotal)}
            </p>
          </div>
        </div>

        <div className="inline-flex w-full max-w-[11.5rem] items-center rounded-full border border-neutral-300 bg-white">
          <button
            type="button"
            aria-label="Eliminar del carrito"
            onClick={onRemove}
            className="flex h-10 w-11 items-center justify-center text-neutral-700 hover:bg-neutral-50"
          >
            <IconTrash />
          </button>
          <button
            type="button"
            disabled={item.quantity <= 1}
            onClick={() => onQuantityChange(item.quantity - 1)}
            className="flex h-10 w-11 items-center justify-center text-lg font-medium disabled:opacity-30"
          >
            −
          </button>
          <span className="flex h-10 min-w-[2.25rem] flex-1 items-center justify-center border-x border-neutral-300 text-sm font-medium">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            className="flex h-10 w-11 items-center justify-center text-lg font-medium"
          >
            +
          </button>
        </div>
      </div>
    </li>
  )
}

export function CartPageView() {
  const { cartItems, totalPrice, removeFromCart, updateCartQuantity } =
    useAppState()
  const isEmpty = cartItems.length === 0

  if (isEmpty) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 hover:underline">
          <ChevronLeft />
          Volver
        </Link>
        <h1 className="mt-10 text-2xl font-semibold text-neutral-900">
          Carrito de compras
        </h1>
        <p className="mt-4 text-neutral-600">Tu carrito está vacío.</p>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-neutral-900 px-8 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Ver catálogo
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10 lg:py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 hover:underline">
        <ChevronLeft />
        Volver
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(280px,380px)] lg:gap-16">
        <section>
          <ul>
            {cartItems.map((item) => (
              <CartLineRow
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onQuantityChange={(qty) =>
                  updateCartQuantity(item.id, Math.max(1, qty))
                }
              />
            ))}
          </ul>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-b border-[var(--border)] py-6">
            <h2 className="text-base font-semibold text-neutral-900">Entrega</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              El envío se confirma por WhatsApp según tu ciudad.
            </p>
          </div>
          <div className="space-y-2 py-6 text-sm text-neutral-900">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCartPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total estimado</span>
              <span>{formatCartPrice(totalPrice)}</span>
            </div>
          </div>
          <CartWhatsAppComposer />
          <Link
            href="/catalogo"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 hover:underline"
          >
            <ChevronLeft />
            Seguir comprando
          </Link>
        </aside>
      </div>
    </main>
  )
}
