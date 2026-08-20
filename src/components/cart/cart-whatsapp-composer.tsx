'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAppState } from '../app-state/app-state-provider'
import {
  buildWhatsAppUrl,
  composeEditableCartWhatsAppMessage,
  formatCartWhatsAppMessage,
} from '../../lib/whatsapp'
import { STORE_WHATSAPP } from '../../lib/constants'

export const CART_WHATSAPP_EXAMPLE_NOTE = [
  'Hola, soy Camila.',
  'Quiero este pedido para Bogotá, preferiblemente contraentrega.',
  '¿Me confirman si hay existencias y cuánto saldría el envío?',
].join('\n')

export function CartWhatsAppComposer() {
  const { cartItems, totalPrice, profile } = useAppState()
  const [phone, setPhone] = useState(STORE_WHATSAPP)
  const [note, setNote] = useState('')

  useEffect(() => {
    fetch('/api/store/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.whatsappNumber) setPhone(data.whatsappNumber)
      })
      .catch(() => {})
  }, [])

  const orderSummary = useMemo(
    () => formatCartWhatsAppMessage(cartItems, totalPrice, profile?.name),
    [cartItems, totalPrice, profile?.name],
  )
  const usingExample = !note.trim()
  const previewMessage = useMemo(
    () =>
      composeEditableCartWhatsAppMessage(
        cartItems,
        totalPrice,
        usingExample ? CART_WHATSAPP_EXAMPLE_NOTE : note,
        profile?.name,
      ),
    [cartItems, totalPrice, usingExample, note, profile?.name],
  )
  const sentMessage = useMemo(
    () =>
      composeEditableCartWhatsAppMessage(
        cartItems,
        totalPrice,
        note,
        profile?.name,
      ),
    [cartItems, totalPrice, note, profile?.name],
  )
  const href = buildWhatsAppUrl(sentMessage, phone)
  const enabled = cartItems.length > 0

  return (
    <div className="space-y-4 border-t border-[var(--border)] pt-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Pedido por WhatsApp
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Redacta tu mensaje. Los productos del carrito se añaden solos.
        </p>
      </div>
      <label className="block text-sm font-medium text-neutral-900">
        Tu mensaje
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder={CART_WHATSAPP_EXAMPLE_NOTE}
          className="mt-2 w-full resize-y rounded-2xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-normal text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
        />
      </label>
      {note.trim() ? (
        <button
          type="button"
          onClick={() => setNote('')}
          className="text-xs font-semibold text-neutral-600 underline-offset-2 hover:underline"
        >
          Borrar mi texto
        </button>
      ) : null}


      <a
        id="checkout"
        href={enabled ? href : undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!enabled}
        className={
          'flex min-h-[52px] w-full items-center justify-center rounded-full text-sm font-semibold text-white ' +
          (enabled
            ? 'bg-neutral-900 hover:bg-neutral-800'
            : 'pointer-events-none bg-neutral-400')
        }
      >
        Enviar pedido por WhatsApp
      </a>
    </div>
  )
}
