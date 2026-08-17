import type { Metadata } from 'next'
import { ProductCatalogGrid } from '../../components/catalog/product-catalog-grid'
import { getSettings, listBrands, listProducts } from '../../lib/store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Zapatos Kova filtrados por marca: Nike, Adidas, New Balance y más.',
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string }>
}) {
  const { marca } = await searchParams
  const [products, brands, settings] = await Promise.all([
    listProducts({ activeOnly: true }),
    listBrands(),
    getSettings(),
  ])

  return (
    <ProductCatalogGrid
      products={products}
      brands={brands}
      initialBrand={marca || 'all'}
      settings={settings}
    />
  )
}
