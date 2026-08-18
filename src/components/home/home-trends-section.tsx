import Link from 'next/link'
import type { Brand, CatalogProduct } from '../../lib/store'
import { MotionSection } from '../ui/motion-section'
import { MotionStaggerItem } from '../ui/motion-stagger-item'
import { CatalogLookCard } from '../catalog/catalog-look-card'

export function HomeTrendsSection({
  products,
  brands,
  total,
  title,
  subtitle,
}: {
  products: CatalogProduct[]
  brands: Brand[]
  total: number
  title: string
  subtitle: string
}) {
  return (
    <MotionSection className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="container py-10 sm:py-14 md:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl md:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
              {subtitle}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-2">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/catalogo?marca=${brand.slug}`}
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold tracking-wide uppercase text-neutral-800 hover:border-neutral-900"
              >
                {brand.name}
              </Link>
            ))}
          </div>
          <Link
            href="/catalogo"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-bold text-white hover:bg-neutral-800"
          >
            Ver catálogo ({total})
          </Link>
        </div>

        <ul className="trends-product-grid mx-auto mt-8 w-full max-w-6xl list-none p-0 sm:mt-10">
          {products.map((product, index) => (
            <MotionStaggerItem
              key={product.id}
              as="li"
              delay={80}
              threshold={0.08}
              className="flex min-h-0 min-w-0 catalog-grid-item"
            >
              <CatalogLookCard product={product} imagePriority={index === 0} />
            </MotionStaggerItem>
          ))}
        </ul>
      </div>
    </MotionSection>
  )
}
