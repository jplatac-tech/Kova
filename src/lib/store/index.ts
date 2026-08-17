import { hasDatabaseUrl } from '../prisma'
import type { Product, SiteSettings } from './types'
import {
  jsonCreateBrand,
  jsonDeleteBrand,
  jsonDeleteProduct,
  jsonGetProductById,
  jsonGetProductBySlug,
  jsonGetSettings,
  jsonListBrands,
  jsonListProducts,
  jsonSaveProduct,
  jsonUpdateBrand,
  jsonUpdateSettings,
} from './json-store'
import {
  prismaCreateBrand,
  prismaDeleteBrand,
  prismaDeleteProduct,
  prismaGetProductById,
  prismaGetProductBySlug,
  prismaGetSettings,
  prismaListBrands,
  prismaListProducts,
  prismaSaveProduct,
  prismaUpdateBrand,
  prismaUpdateSettings,
} from './prisma-store'

export type { Brand, CatalogProduct, Product, ProductSize, SiteSettings } from './types'
export { DEFAULT_SHOE_SIZES, DEFAULT_SETTINGS } from './types'

export function usesDatabase() {
  return hasDatabaseUrl()
}

function isDbUnreachable(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const err = error as { code?: string; message?: string }
  if (err.code === 'P1001') return true
  const msg = String(err.message ?? '').toLowerCase()
  return (
    msg.includes("can't reach database") ||
    msg.includes('databasenotreachable') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound')
  )
}

async function withStoreFallback<T>(
  prismaFn: () => Promise<T>,
  jsonFn: () => Promise<T>,
): Promise<T> {
  if (!usesDatabase()) return jsonFn()
  try {
    return await prismaFn()
  } catch (error) {
    if (isDbUnreachable(error)) {
      console.warn(
        '[kova] Supabase no alcanzable desde esta red. Usando data/kova-store.json.',
      )
      return jsonFn()
    }
    throw error
  }
}

export async function listBrands() {
  return withStoreFallback(prismaListBrands, jsonListBrands)
}

export async function createBrand(input: { name: string; slug?: string }) {
  return withStoreFallback(
    () => prismaCreateBrand(input),
    () => jsonCreateBrand(input),
  )
}

export async function updateBrand(
  id: string,
  input: { name?: string; slug?: string },
) {
  return withStoreFallback(
    () => prismaUpdateBrand(id, input),
    () => jsonUpdateBrand(id, input),
  )
}

export async function deleteBrand(id: string) {
  return withStoreFallback(
    () => prismaDeleteBrand(id),
    () => jsonDeleteBrand(id),
  )
}

export async function listProducts(opts?: { activeOnly?: boolean }) {
  return withStoreFallback(
    () => prismaListProducts(opts),
    () => jsonListProducts(opts),
  )
}

export async function getProductBySlug(slug: string) {
  return withStoreFallback(
    () => prismaGetProductBySlug(slug),
    () => jsonGetProductBySlug(slug),
  )
}

export async function getProductById(id: string) {
  return withStoreFallback(
    () => prismaGetProductById(id),
    () => jsonGetProductById(id),
  )
}

export async function saveProduct(
  input: Partial<Product> & { name: string; brandId: string; price: number },
) {
  return withStoreFallback(
    () => prismaSaveProduct(input),
    () => jsonSaveProduct(input),
  )
}

export async function deleteProduct(id: string) {
  return withStoreFallback(
    () => prismaDeleteProduct(id),
    () => jsonDeleteProduct(id),
  )
}

export async function getSettings(): Promise<SiteSettings> {
  return withStoreFallback(prismaGetSettings, jsonGetSettings)
}

export async function updateSettings(patch: Partial<SiteSettings>) {
  return withStoreFallback(
    () => prismaUpdateSettings(patch),
    () => jsonUpdateSettings(patch),
  )
}
