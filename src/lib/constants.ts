export const APP_NAME = 'Kova'
export const LOGO_SRC = '/brand/kova-logo.jpg'

/** Número con código de país, sin + (ej. 573216678821). Configura NEXT_PUBLIC_WHATSAPP_NUMBER en .env */
export const STORE_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || '573216678821'

/** Formato legible para mostrar en la UI */
export const STORE_WHATSAPP_DISPLAY = '+57 321 6678821'

export const HELP_WHATSAPP_MESSAGE =
  '¡Hola! Quiero información sobre un modelo de Kova.'
