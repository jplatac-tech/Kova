import 'server-only'
import { Prisma } from '@prisma/client'
import { slugify } from '../slug'
import { getPrisma } from '../prisma'
import {
  DEFAULT_SETTINGS,
  type Brand,
  type CatalogProduct,
  type Product,
  type SiteSettings,
} from './types'

function prismaOrThrow() {
  const prisma = getPrisma()
  if (!prisma) throw new Error('DATABASE_URL no configurada')
  return prisma
}

function mapProduct(
  row: {
    id: string
    slug: string
    name: string
    description: string
    price: number
    brandId: string
    images: string[]
    badge: string | null
    featured: boolean
    isActive: boolean
    sizes: { label: string; stock: number }[]
    brand: { name: string; slug: string }
  },
): CatalogProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    brandId: row.brandId,
    images: row.images,
    badge: row.badge || undefined,
    featured: row.featured,
    isActive: row.isActive,
    sizes: row.sizes.map((size) => ({ label: size.label, stock: size.stock })),
    brandName: row.brand.name,
    brandSlug: row.brand.slug,
  }
}

const productInclude = {
  brand: true,
  sizes: { orderBy: { label: 'asc' as const } },
} satisfies Prisma.ProductInclude

export async function prismaListBrands(): Promise<Brand[]> {
  const prisma = prismaOrThrow()
  const rows = await prisma.brand.findMany({ orderBy: { name: 'asc' } })
  return rows.map((row) => ({ id: row.id, name: row.name, slug: row.slug }))
}

export async function prismaCreateBrand(input: { name: string; slug?: string }) {
  const prisma = prismaOrThrow()
  const name = input.name.trim()
  if (!name) throw new Error('El nombre de la marca es obligatorio')
  const slug = slugify(input.slug || name)
  const row = await prisma.brand.create({ data: { name, slug } })
  return { id: row.id, name: row.name, slug: row.slug }
}

export async function prismaUpdateBrand(
  id: string,
  input: { name?: string; slug?: string },
) {
  const prisma = prismaOrThrow()
  const row = await prisma.brand.update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.slug ? { slug: slugify(input.slug) } : {}),
    },
  })
  return { id: row.id, name: row.name, slug: row.slug }
}

export async function prismaDeleteBrand(id: string) {
  const prisma = prismaOrThrow()
  const count = await prisma.product.count({ where: { brandId: id } })
  if (count > 0) {
    throw new Error('No se puede eliminar: hay productos con esta marca')
  }
  await prisma.brand.delete({ where: { id } })
}

export async function prismaListProducts(opts?: { activeOnly?: boolean }) {
  const prisma = prismaOrThrow()
  const rows = await prisma.product.findMany({
    where: opts?.activeOnly ? { isActive: true } : undefined,
    include: productInclude,
    orderBy: { name: 'asc' },
  })
  return rows.map(mapProduct)
}

export async function prismaGetProductBySlug(slug: string) {
  const prisma = prismaOrThrow()
  const row = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  })
  return row ? mapProduct(row) : null
}

export async function prismaGetProductById(id: string) {
  const prisma = prismaOrThrow()
  const row = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  })
  return row ? mapProduct(row) : null
}

export async function prismaSaveProduct(
  input: Partial<Product> & { name: string; brandId: string; price: number },
) {
  const prisma = prismaOrThrow()
  if (!input.brandId) {
    throw new Error('Elige una marca. Si la lista está vacía, créala en Admin → Marcas.')
  }
  const brand = await prisma.brand.findUnique({ where: { id: input.brandId } })
  if (!brand) {
    throw new Error(
      'Esa marca no existe en Postgres. Créala en Admin → Marcas (los datos del JSON local no sirven en Vercel).',
    )
  }
  const slug = slugify(input.slug || input.name)
  const data = {
    slug,
    name: input.name.trim(),
    description: input.description?.trim() ?? '',
    price: Number(input.price) || 0,
    brandId: input.brandId,
    images: (input.images ?? []).filter(Boolean),
    badge: input.badge?.trim() || null,
    featured: Boolean(input.featured),
    isActive: input.isActive !== false,
  }

  const sizes = (input.sizes ?? []).map((size) => ({
    label: String(size.label).trim(),
    stock: Math.max(0, Number(size.stock) || 0),
  }))

  const row = input.id
    ? await prisma.product.update({
        where: { id: input.id },
        data: {
          ...data,
          sizes: {
            deleteMany: {},
            create: sizes,
          },
        },
        include: productInclude,
      })
    : await prisma.product.create({
        data: {
          ...data,
          sizes: { create: sizes },
        },
        include: productInclude,
      })

  return mapProduct(row)
}

export async function prismaDeleteProduct(id: string) {
  const prisma = prismaOrThrow()
  await prisma.product.delete({ where: { id } })
}

export async function prismaGetSettings(): Promise<SiteSettings> {
  const prisma = prismaOrThrow()
  const row =
    (await prisma.siteSettings.findUnique({ where: { id: 'default' } })) ??
    (await prisma.siteSettings.create({
      data: { id: 'default', ...DEFAULT_SETTINGS },
    }))
  return mapSiteSettings(row)
}

function mapSiteSettings(row: {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  featuredTitle?: string | null
  featuredSubtitle?: string | null
  catalogTitle: string
  catalogSubtitle: string
  footerTagline?: string | null
  footerText: string
  footerContactLabel?: string | null
  footerWhatsappMessage?: string | null
  footerCredit?: string | null
  whatsappNumber: string
  whatsappMessage?: string | null
}): SiteSettings {
  return {
    heroEyebrow: row.heroEyebrow || DEFAULT_SETTINGS.heroEyebrow,
    heroTitle: row.heroTitle || DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: row.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
    heroImage: row.heroImage || DEFAULT_SETTINGS.heroImage,
    featuredTitle: row.featuredTitle || DEFAULT_SETTINGS.featuredTitle,
    featuredSubtitle:
      row.featuredSubtitle || DEFAULT_SETTINGS.featuredSubtitle,
    catalogTitle: row.catalogTitle || DEFAULT_SETTINGS.catalogTitle,
    catalogSubtitle: row.catalogSubtitle || DEFAULT_SETTINGS.catalogSubtitle,
    footerTagline: row.footerTagline ?? DEFAULT_SETTINGS.footerTagline,
    footerText: row.footerText ?? DEFAULT_SETTINGS.footerText,
    footerContactLabel:
      row.footerContactLabel?.trim() || DEFAULT_SETTINGS.footerContactLabel,
    footerWhatsappMessage: row.footerWhatsappMessage ?? '',
    footerCredit: row.footerCredit ?? DEFAULT_SETTINGS.footerCredit,
    whatsappNumber: row.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
    whatsappMessage:
      row.whatsappMessage?.trim() || DEFAULT_SETTINGS.whatsappMessage,
  }
}

export async function prismaUpdateSettings(patch: Partial<SiteSettings>) {
  const prisma = prismaOrThrow()
  await prismaGetSettings()
  const data: Partial<SiteSettings> = { ...patch }
  if (typeof data.whatsappNumber === 'string') {
    data.whatsappNumber = data.whatsappNumber.replace(/\D/g, '')
  }
  if (typeof data.whatsappMessage === 'string') {
    data.whatsappMessage = data.whatsappMessage.trim()
  }
  if (typeof data.footerWhatsappMessage === 'string') {
    data.footerWhatsappMessage = data.footerWhatsappMessage.trim()
  }
  if (typeof data.footerContactLabel === 'string') {
    data.footerContactLabel = data.footerContactLabel.trim()
  }
  const row = await prisma.siteSettings.update({
    where: { id: 'default' },
    data,
  })
  return mapSiteSettings(row)
}
