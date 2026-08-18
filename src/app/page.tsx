import type { Metadata } from 'next'
import { HomeHero } from '../components/home/home-hero'
import { HomeTrendsSection } from '../components/home/home-trends-section'
import { getSettings, listBrands, listProducts } from '../lib/store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Kova — tienda de zapatos. Catálogo por marca, tallas y pedidos por WhatsApp.',
}

export default async function HomePage() {
  const [settings, brands, products] = await Promise.all([
    getSettings(),
    listBrands(),
    listProducts({ activeOnly: true }),
  ])
  const featured = products.filter((product) => product.featured).slice(0, 6)
  const trending = featured.length > 0 ? featured : products.slice(0, 6)

  return (
    <>
      <HomeHero settings={settings} />
      <HomeTrendsSection
        products={trending}
        brands={brands}
        total={products.length}
        title={settings.featuredTitle}
        subtitle={settings.featuredSubtitle}
      />
    </>
  )
}
