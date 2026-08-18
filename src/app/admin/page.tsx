import Link from 'next/link'
import { listBrands, listProducts, usesDatabase } from '../../lib/store'
import { AdminHeader, AdminPage } from '../../components/admin/admin-ui'

export const dynamic = 'force-dynamic'

export default async function AdminHomePage() {
  const [products, brands] = await Promise.all([listProducts(), listBrands()])
  const outOfStock = products.filter(
    (product) => !product.sizes.some((size) => size.stock > 0),
  ).length

  const stats = [
    { label: 'Productos', value: products.length, href: '/admin/products' },
    { label: 'Marcas', value: brands.length, href: '/admin/brands' },
    { label: 'Agotados', value: outOfStock, href: '/admin/products' },
  ]

  const actions = [
    {
      href: '/admin/products/new',
      title: 'Añadir producto',
      text: 'Nombre, precio, fotos, tallas y stock.',
    },
    {
      href: '/admin/brands',
      title: 'Gestionar marcas',
      text: 'Filtros que aparecen en el catálogo.',
    },
    {
      href: '/admin/settings',
      title: 'Textos de la tienda',
      text: 'Hero, catálogo, WhatsApp y pie.',
    },
    {
      href: '/admin/security',
      title: 'Credenciales',
      text: 'Correo y contraseña del administrador.',
    },
  ]

  return (
    <AdminPage>
      <AdminHeader
        title="Panel Kova"
        description={
          usesDatabase()
            ? 'Administra el catálogo. Los datos se guardan en Postgres.'
            : 'Administra el catálogo. Ahora mismo se usa el archivo local; en Vercel conecta Postgres.'
        }
        actions={
          <Link href="/admin/products/new" className="admin-btn admin-btn--primary">
            Añadir producto
          </Link>
        }
      />

      <div className="admin-stagger grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-stat admin-rise block p-5">
            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="admin-stagger mt-6 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="admin-action admin-rise block p-5"
          >
            <p className="font-semibold">{action.title}</p>
            <p className="mt-1 text-sm text-neutral-500">{action.text}</p>
          </Link>
        ))}
      </div>
    </AdminPage>
  )
}
