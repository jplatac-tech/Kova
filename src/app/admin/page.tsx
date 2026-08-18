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
    { label: 'Productos', value: products.length, href: '/admin/products', hint: 'En el catálogo' },
    { label: 'Marcas', value: brands.length, href: '/admin/brands', hint: 'Filtros activos' },
    { label: 'Agotados', value: outOfStock, href: '/admin/products', hint: 'Sin stock' },
  ]

  const groups = [
    {
      title: 'Catálogo',
      items: [
        {
          href: '/admin/products/new',
          title: 'Añadir producto',
          text: 'Nombre, precio, fotos, tallas y stock.',
        },
        {
          href: '/admin/products',
          title: 'Ver productos',
          text: 'Edita precios, imágenes y existencias.',
        },
        {
          href: '/admin/brands',
          title: 'Gestionar marcas',
          text: 'Nike, Adidas y las que uses en filtros.',
        },
      ],
    },
    {
      title: 'Tienda',
      items: [
        {
          href: '/admin/settings',
          title: 'Textos y WhatsApp',
          text: 'Hero, pie y el mensaje que llega al chat.',
        },
        {
          href: '/admin/security',
          title: 'Credenciales',
          text: 'Correo y contraseña del administrador.',
        },
      ],
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
            <p className="mt-1 text-xs text-neutral-400">{stat.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="admin-section-title">{group.title}</h2>
            <div className="admin-stagger mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((action) => (
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
          </section>
        ))}
      </div>
    </AdminPage>
  )
}
