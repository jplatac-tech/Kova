export type Brand = {
  id: string
  name: string
  slug: string
}

export type ProductSize = {
  label: string
  stock: number
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  brandId: string
  images: string[]
  badge?: string
  featured: boolean
  isActive: boolean
  sizes: ProductSize[]
}

export type SiteSettings = {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  featuredTitle: string
  featuredSubtitle: string
  catalogTitle: string
  catalogSubtitle: string
  footerTagline: string
  footerText: string
  footerContactLabel: string
  footerWhatsappMessage: string
  footerCredit: string
  /** Solo dígitos con código de país, ej. 573216678821 */
  whatsappNumber: string
  /** Mensaje que se abre en WhatsApp. Usa {producto} para el nombre del modelo. */
  whatsappMessage: string
}

export type CatalogProduct = Product & {
  brandName: string
  brandSlug: string
}

export type StoreData = {
  brands: Brand[]
  products: Product[]
  settings: SiteSettings
}

export const DEFAULT_SETTINGS: SiteSettings = {
  heroEyebrow: 'Kova',
  heroTitle: 'Zapatos que definen tu estilo',
  heroSubtitle:
    'Selección de Nike, Adidas, New Balance y más. Tallas reales, existencias al día y pedidos por WhatsApp.',
  heroImage:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=80',
  featuredTitle: 'Destacados',
  featuredSubtitle:
    'Una selección de pares listos para enviar. El catálogo completo se filtra por marca.',
  catalogTitle: 'Catálogo',
  catalogSubtitle: 'Filtra por marca y encuentra tu par.',
  footerTagline:
    'Zapatos que definen tu estilo. Elige marca, talla y pídelos por WhatsApp.',
  footerText: '',
  footerContactLabel: 'Contáctanos',
  footerWhatsappMessage: '',
  footerCredit: 'Hecho para encontrar tu par.',
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || '573216678821',
  whatsappMessage:
    '¡Hola! Quiero información sobre un modelo de Kova.',
}

export const DEFAULT_SHOE_SIZES = [
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
] as const
