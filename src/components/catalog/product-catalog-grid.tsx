'use client'

import { useMemo, useState } from 'react'
import type { Brand, CatalogProduct, SiteSettings } from '../../lib/store'
import { useInView } from '../../hooks/use-in-view'
import { MotionStaggerItem } from '../ui/motion-stagger-item'
import { CatalogLookCard } from './catalog-look-card'

export function ProductCatalogGrid({
  products,
  brands,
  initialBrand = 'all',
  settings,
}: {
  products: CatalogProduct[]
  brands: Brand[]
  initialBrand?: string
  settings: SiteSettings
}) {
  const [filter, setFilter] = useState(initialBrand || 'all')
  const { ref, visible } = useInView<HTMLDivElement>(0.06)

  const filtered = useMemo(() => {
    if (filter === 'all') return products
    return products.filter((product) => product.brandSlug === filter)
  }, [products, filter])

  const chips = [{ slug: 'all', name: 'Todas' }, ...brands]

  return (
    <div ref={ref} className={'bg-[var(--background)] motion-in-view ' + (visible ? 'is-visible' : '')}>
      <div className="container border-b border-[var(--border)] py-8 text-center sm:py-10 md:py-14">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl md:text-[28px]">
          {settings.catalogTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-xl px-1 text-sm text-neutral-600 md:text-base">
          {settings.catalogSubtitle}
        </p>
      </div>

      <div className="sticky top-[var(--header-height)] z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,white_92%,var(--sand))] backdrop-blur-md">
        <div className="container relative">
          <div
            className="filter-scroll filter-scroll-bleed"
            role="tablist"
            aria-label="Filtrar por marca"
          >
            {chips.map((chip) => {
              const active = filter === chip.slug
              return (
                <button
                  key={chip.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(chip.slug)}
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
        </div>
      </div>

      <div className="container py-6 sm:py-8 md:py-12">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-600">
            No hay productos en esta marca todavía.
          </p>
        ) : (
          <div key={filter} className="catalog-product-grid motion-catalog-enter">
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
