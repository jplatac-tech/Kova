import { promises as fs } from 'fs'
import { join } from 'path'
import { slugify } from '../slug'
import {
  DEFAULT_SETTINGS,
  type Brand,
  type CatalogProduct,
  type Product,
  type SiteSettings,
  type StoreData,
} from './types'

const STORE_PATH = join(process.cwd(), 'data', 'kova-store.json')

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function withBrand(product: Product, brands: Brand[]): CatalogProduct {
  const brand = brands.find((item) => item.id === product.brandId)
  return {
    ...product,
    brandName: brand?.name ?? 'Sin marca',
    brandSlug: brand?.slug ?? 'sin-marca',
  }
}

async function readStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8')
    const data = JSON.parse(raw) as StoreData
    return {
      brands: data.brands ?? [],
      products: data.products ?? [],
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    }
  } catch {
    return { brands: [], products: [], settings: DEFAULT_SETTINGS }
  }
}

async function writeStore(data: StoreData) {
  await fs.mkdir(join(process.cwd(), 'data'), { recursive: true })
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function jsonListBrands(): Promise<Brand[]> {
  const store = await readStore()
  return [...store.brands].sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export async function jsonCreateBrand(input: { name: string; slug?: string }) {
  const store = await readStore()
  const name = input.name.trim()
  if (!name) throw new Error('El nombre de la marca es obligatorio')
  const slug = slugify(input.slug || name)
  if (store.brands.some((brand) => brand.slug === slug)) {
    throw new Error('Ya existe una marca con ese nombre')
  }
  const brand: Brand = { id: newId('brand'), name, slug }
  store.brands.push(brand)
  await writeStore(store)
  return brand
}

export async function jsonUpdateBrand(
  id: string,
  input: { name?: string; slug?: string },
) {
  const store = await readStore()
  const brand = store.brands.find((item) => item.id === id)
  if (!brand) throw new Error('Marca no encontrada')
  if (input.name) brand.name = input.name.trim()
  if (input.slug) brand.slug = slugify(input.slug)
  await writeStore(store)
  return brand
}

export async function jsonDeleteBrand(id: string) {
  const store = await readStore()
  if (store.products.some((product) => product.brandId === id)) {
    throw new Error('No se puede eliminar: hay productos con esta marca')
  }
  store.brands = store.brands.filter((brand) => brand.id !== id)
  await writeStore(store)
}

export async function jsonListProducts(opts?: {
  activeOnly?: boolean
}): Promise<CatalogProduct[]> {
  const store = await readStore()
  return store.products
    .filter((product) => (opts?.activeOnly ? product.isActive : true))
    .map((product) => withBrand(product, store.brands))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export async function jsonGetProductBySlug(
  slug: string,
): Promise<CatalogProduct | null> {
  const store = await readStore()
  const product = store.products.find((item) => item.slug === slug)
  return product ? withBrand(product, store.brands) : null
}

export async function jsonGetProductById(
  id: string,
): Promise<CatalogProduct | null> {
  const store = await readStore()
  const product = store.products.find((item) => item.id === id)
  return product ? withBrand(product, store.brands) : null
}

export async function jsonSaveProduct(
  input: Partial<Product> & { name: string; brandId: string; price: number },
) {
  const store = await readStore()
  if (!store.brands.some((brand) => brand.id === input.brandId)) {
    throw new Error('Marca no válida')
  }

  const slug = slugify(input.slug || input.name)
  const existing = input.id
    ? store.products.find((item) => item.id === input.id)
    : undefined

  if (
    store.products.some(
      (item) => item.slug === slug && item.id !== existing?.id,
    )
  ) {
    throw new Error('Ya existe un producto con esa URL')
  }

  const product: Product = {
    id: existing?.id ?? newId('prod'),
    slug,
    name: input.name.trim(),
    description: input.description?.trim() ?? '',
    price: Number(input.price) || 0,
    brandId: input.brandId,
    images: (input.images ?? existing?.images ?? []).filter(Boolean),
    badge: input.badge?.trim() || undefined,
    featured: Boolean(input.featured),
    isActive: input.isActive !== false,
    sizes: (input.sizes ?? existing?.sizes ?? []).map((size) => ({
      label: String(size.label).trim(),
      stock: Math.max(0, Number(size.stock) || 0),
    })),
  }

  store.products = store.products.filter((item) => item.id !== product.id)
  store.products.push(product)
  await writeStore(store)
  return withBrand(product, store.brands)
}

export async function jsonDeleteProduct(id: string) {
  const store = await readStore()
  store.products = store.products.filter((product) => product.id !== id)
  await writeStore(store)
}

export async function jsonGetSettings(): Promise<SiteSettings> {
  const store = await readStore()
  return store.settings
}

export async function jsonUpdateSettings(patch: Partial<SiteSettings>) {
  const store = await readStore()
  const next = { ...store.settings, ...patch }
  if (typeof patch.whatsappNumber === 'string') {
    next.whatsappNumber = patch.whatsappNumber.replace(/\D/g, '')
  }
  if (typeof patch.whatsappMessage === 'string') {
    next.whatsappMessage = patch.whatsappMessage.trim()
  }
  store.settings = next
  await writeStore(store)
  return store.settings
}
