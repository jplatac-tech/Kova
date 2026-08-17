'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAppState } from '../components/app-state/app-state-provider'
import {
  buildWhatsAppUrl,
  formatCartWhatsAppMessage,
  formatQuickQuoteMessage,
} from '../lib/whatsapp'
import { STORE_WHATSAPP } from '../lib/constants'

export type NavWhatsAppAction = {
  href: string
  label: string
  shortLabel: string
  enabled: boolean
}

export function useNavWhatsAppHref(): NavWhatsAppAction {
  const pathname = usePathname()
  const { cartItems, totalPrice, profile } = useAppState()
  const isCart = pathname === '/carrito' || pathname.startsWith('/carrito/')
  const [phone, setPhone] = useState(STORE_WHATSAPP)

  useEffect(() => {
    fetch('/api/store/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.whatsappNumber) setPhone(data.whatsappNumber)
      })
      .catch(() => {})
  }, [])

  return useMemo(() => {
    if (isCart) {
      const enabled = cartItems.length > 0
      return {
        href: enabled
          ? buildWhatsAppUrl(
              formatCartWhatsAppMessage(cartItems, totalPrice, profile?.name),
              phone,
            )
          : '#',
        label: 'Confirmar por WhatsApp',
        shortLabel: 'WhatsApp',
        enabled,
      }
    }

    const productSlug = pathname.match(/^\/productos\/([^/]+)/)?.[1]
    return {
      href: buildWhatsAppUrl(
        formatQuickQuoteMessage(
          productSlug ? decodeURIComponent(productSlug) : undefined,
        ),
        phone,
      ),
      label: 'Escribir por WhatsApp',
      shortLabel: 'WhatsApp',
      enabled: true,
    }
  }, [isCart, cartItems, totalPrice, profile?.name, pathname, phone])
}
