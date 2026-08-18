/**
 * Seed inicial de marcas y productos en Postgres (Supabase).
 * Uso: DATABASE_URL="..." npx tsx prisma/seed.ts
 */
import { readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { getDatabaseUrl } from '../src/lib/database-url'
import type { StoreData } from '../src/lib/store/types'

const url = getDatabaseUrl()

if (!url) {
  console.error('Falta DATABASE_URL (o POSTGRES_URL).')
  process.exit(1)
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  }),
})

async function main() {
  const raw = readFileSync(join(process.cwd(), 'data', 'kova-store.json'), 'utf-8')
  const data = JSON.parse(raw) as StoreData

  const brandIdMap = new Map<string, string>()

  for (const brand of data.brands) {
    const row = await prisma.brand.upsert({
      where: { slug: brand.slug },
      create: { name: brand.name, slug: brand.slug },
      update: { name: brand.name },
    })
    brandIdMap.set(brand.id, row.id)
    console.log('Marca:', row.name)
  }

  for (const product of data.products) {
    const brandId = brandIdMap.get(product.brandId)
    if (!brandId) {
      console.warn('Sin marca para', product.slug)
      continue
    }

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    })

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          badge: product.badge || null,
          featured: product.featured,
          isActive: product.isActive,
          images: product.images,
          brandId,
          sizes: {
            deleteMany: {},
            create: product.sizes.map((size) => ({
              label: size.label,
              stock: size.stock,
            })),
          },
        },
      })
      console.log('Actualizado:', product.name)
    } else {
      await prisma.product.create({
        data: {
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          badge: product.badge || null,
          featured: product.featured,
          isActive: product.isActive,
          images: product.images,
          brandId,
          sizes: {
            create: product.sizes.map((size) => ({
              label: size.label,
              stock: size.stock,
            })),
          },
        },
      })
      console.log('Creado:', product.name)
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...data.settings },
    update: { ...data.settings },
  })
  console.log('Settings OK')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seed listo.')
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
