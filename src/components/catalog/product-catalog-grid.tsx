'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Brand, CatalogProduct } from '../../lib/store'
import { useInView } from '../../hooks/use-in-view'
import { MotionStaggerItem } from '../ui/motion-stagger-item'
import { CatalogLookCard } from './catalog-look-card'

const PRICE_PRESETS = [
  { id: 'all', label: 'Cualquier precio' },
  { id: '0-500000', label: 'Hasta $500.000' },
  { id: '500000-700000', label: '$500.000 – $700.000' },
  { id: '700000-', label: 'Más de $700.000' },
] as const

function parsePriceRange(value: string | null) {
  if (!value || value === 'all') return null
  const [minRaw, maxRaw] = value.split('-')
  const min = minRaw ? Number(minRaw) : 0
  const max = maxRaw ? Number(maxRaw) : Number.POSITIVE_INFINITY
  if (Number.isNaN(min) || Number.isNaN(max)) return null
  return { min, max }
}

export function ProductCatalogGrid({
  products,
  brands,
}: {
  products: CatalogProduct[]
  brands: Brand[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { ref, visible } = useInView<HTMLDivElement>(0.06)

  const brand = searchParams.get('marca') || 'all'
  const size = searchParams.get('talla') || 'all'
  const price = searchParams.get('precio') || 'all'
  const query = (searchParams.get('q') || '').trim()

  const sizes = useMemo(() => {
    const labels = new Set<string>()
    for (const product of products) {
      for (const item of product.sizes) {
        if (item.stock > 0) labels.add(item.label)
      }
    }
    return [...labels].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b, 'es'))
  }, [products])

  const filtered = useMemo(() => {
    const range = parsePriceRange(price)
    const needle = query.toLocaleLowerCase('es')
    return products.filter((product) => {
      if (brand !== 'all' && product.brandSlug !== brand) return false
      if (size !== 'all' && !product.sizes.some((item) => item.label === size && item.stock > 0)) {
        return false
      }
      if (range && (product.price < range.min || product.price > range.max)) return false
      if (needle) {
        const haystack = `${product.name} ${product.brandName} ${product.description}`.toLocaleLowerCase('es')
        if (!haystack.includes(needle)) return false
      }
      return true
    })
  }, [products, brand, size, price, query])

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === 'all') params.delete(key)
    else params.set(key, value)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  function clearFilters() {
    router.replace('/catalogo', { scroll: false })
  }

  const chips = [{ slug: 'all', name: 'Todas' }, ...brands]
  const hasFilters = brand !== 'all' || size !== 'all' || price !== 'all' || Boolean(query)

  return (
    <div ref={ref} className={'bg-[var(--background)] motion-in-view ' + (visible ? 'is-visible' : '')}>
      <h1 className="sr-only">Catálogo</h1>
      <div className="sticky top-[var(--header-height)] z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,white_92%,var(--sand))] backdrop-blur-md">
        <div className="container py-3 sm:py-3.5">
          <div
            className="filter-scroll filter-scroll-bleed !py-0"
            role="tablist"
            aria-label="Filtrar por marca"
          >
            {chips.map((chip) => {
              const active = brand === chip.slug
              return (
                <button
                  key={chip.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter('marca', chip.slug)}
                  className={
                    'filter-chip min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-semibold sm:min-h-[40px] sm:px-4 sm:py-2 sm:text-sm ' +
                    (active
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-white text-neutral-700 hover:bg-[var(--surface-muted)]')
                  }
                >
                  {chip.name}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="catalog-filter-select">
              <span className="sr-only">Talla</span>
              <select
                value={size}
                onChange={(e) => setFilter('talla', e.target.value)}
                aria-label="Filtrar por talla"
              >
                <option value="all">Talla</option>
                {sizes.map((label) => (
                  <option key={label} value={label}>
                    Talla {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="catalog-filter-select">
              <span className="sr-only">Precio</span>
              <select
                value={price}
                onChange={(e) => setFilter('precio', e.target.value)}
                aria-label="Filtrar por precio"
              >
                {PRICE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="ml-auto text-xs font-medium text-neutral-500 sm:text-sm">
              {filtered.length} {filtered.length === 1 ? 'par' : 'pares'}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-white"
              >
                Limpiar
              </button>
            ) : null}
          </div>

          {query ? (
            <p className="mt-2 text-xs text-neutral-600 sm:text-sm">
              Resultados para <span className="font-semibold text-neutral-900">“{query}”</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="container py-6 sm:py-8 md:py-12">
        {filtered.length === 0 ? (
          <div className="mx-auto max-w-md py-12 text-center">
            <p className="text-sm font-semibold text-neutral-900">
              No hay pares con esos filtros.
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Prueba otra marca, talla o rango de precio
              {query ? `, o busca un nombre distinto.` : '.'}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex min-h-[42px] items-center rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white"
              >
                Ver todo el catálogo
              </button>
            ) : null}
          </div>
        ) : (
          <div key={`${brand}-${size}-${price}-${query}`} className="catalog-product-grid motion-catalog-enter">
            {filtered.map((product, index) => (
              <MotionStaggerItem
                key={product.id}
                threshold={0.1}
                className="flex min-h-0 min-w-0 catalog-grid-item"
              >
                <CatalogLookCard
                  product={product}
                  imagePriority={index < 2}
                />
              </MotionStaggerItem>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
