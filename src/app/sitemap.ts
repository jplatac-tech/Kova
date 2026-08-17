import type { MetadataRoute } from 'next'
import { listProducts } from '../lib/store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
  )
  const now = new Date()
  const products = await listProducts({ activeOnly: true })

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${base}/catalogo`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/carrito`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...products.map((product) => ({
      url: `${base}/productos/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
