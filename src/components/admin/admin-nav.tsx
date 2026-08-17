'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const LINKS = [
  { href: '/admin', label: 'Inicio' },
  { href: '/admin/products', label: 'Productos' },
  { href: '/admin/brands', label: 'Marcas' },
  { href: '/admin/settings', label: 'Página' },
  { href: '/admin/security', label: 'Seguridad' },
] as const

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') return null

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-[var(--border)] bg-white" aria-label="Admin">
      <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {LINKS.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'rounded-full px-4 py-2 text-sm font-semibold transition ' +
                  (active
                    ? 'bg-neutral-900 text-white'
                    : 'bg-[var(--surface-muted)] text-neutral-800 hover:bg-[var(--sand)]')
                }
              >
                {item.label}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="font-medium text-neutral-600 hover:underline">
            Tienda
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="font-medium text-neutral-600 hover:underline"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
