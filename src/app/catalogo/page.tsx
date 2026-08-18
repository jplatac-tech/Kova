import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductCatalogGrid } from '../../components/catalog/product-catalog-grid'
import { listBrands, listProducts } from '../../lib/store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Zapatos Kova: filtra por marca, talla y precio, o busca por nombre.',
}

function CatalogFallback() {
  return (
    <div className="container py-16 text-center text-sm text-neutral-500">
      Cargando catálogo…
    </div>
  )
}

export default async function CatalogoPage() {
  const [products, brands] = await Promise.all([
    listProducts({ activeOnly: true }),
    listBrands(),
  ])

  return (
    <Suspense fallback={<CatalogFallback />}>
      <ProductCatalogGrid products={products} brands={brands} />
    </Suspense>
  )
}
