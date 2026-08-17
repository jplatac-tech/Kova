import { STORE_WHATSAPP } from './constants'
import type { CartItem } from '../components/app-state/app-state-provider'
import { formatPrice } from './utils'

function digitsOnly(phone: string) {
  return phone.replace(/\D/g, '')
}

export function getStoreWhatsAppDigits(override?: string) {
  const fromOverride = override?.trim() ? digitsOnly(override) : ''
  return fromOverride || digitsOnly(STORE_WHATSAPP)
}

export function formatWhatsAppDisplay(phone?: string) {
  const digits = getStoreWhatsAppDigits(phone)
  if (!digits) return ''
  if (digits.startsWith('57') && digits.length >= 12) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
  }
  return `+${digits}`
}

export function buildWhatsAppUrl(
  message: string,
  phone = getStoreWhatsAppDigits(),
) {
  const digits = getStoreWhatsAppDigits(phone)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${digits}?text=${encoded}`
}

export function openStoreWhatsApp(message: string, phone?: string) {
  if (typeof window === 'undefined') return
  window.location.assign(buildWhatsAppUrl(message, phone))
}

export function formatCartWhatsAppMessage(
  items: CartItem[],
  totalPrice: number,
  customerName?: string,
): string {
  const lines = ['¡Hola! Quiero comprar en Kova:', '']
  if (customerName?.trim()) {
    lines.push(`Nombre: ${customerName.trim()}`, '')
  }
  items.forEach((item, index) => {
    const size = item.size ? ` · Talla ${item.size}` : ''
    const subtotal = item.price * item.quantity
    lines.push(
      `${index + 1}. ${item.name}${size} — ${item.quantity} u. — ${formatPrice(subtotal)}`,
    )
  })
  lines.push(
    '',
    `Total estimado: ${formatPrice(totalPrice)}`,
    '',
    '¿Me confirman disponibilidad y envío?',
  )
  return lines.join('\n')
}

export function formatQuickQuoteMessage(productName?: string): string {
  if (productName) {
    return `¡Hola! Me interesa este modelo de Kova: ${productName}. ¿Tienen tallas disponibles?`
  }
  return '¡Hola! Quiero información sobre un modelo de Kova.'
}

export function formatDesignQuoteMessage(
  _designJson?: string | null,
  productName?: string,
) {
  return formatQuickQuoteMessage(productName)
}

export function formatPurchaseQuoteMessage(opts: {
  productName?: string
  productSize?: string
  quantityDesired?: number
}) {
  return formatQuickQuoteMessage(opts.productName)
}

export function formatQuoteDeliveryWhatsAppMessage(opts: {
  quoteId?: string
  customerName: string
  customerWhatsapp?: string
  customerEmail?: string
  neededBy?: string
  deliveryNotes?: string
}) {
  return `¡Hola! Soy ${opts.customerName} y quiero confirmar un pedido en Kova.`
}

export function formatOrderSentWhatsAppMessage() {
  return '¡Hola! Acabo de enviar un pedido desde Kova.'
}
