'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LOGO_SRC } from '../../lib/constants'

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
    <nav className="admin-nav" aria-label="Admin">
      <div className="container">
        <div className="admin-nav__top">
          <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
            <Image
              src={LOGO_SRC}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--border)]"
            />
            <span className="truncate text-sm font-semibold tracking-tight">
              Kova <span className="font-medium text-neutral-500">Admin</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className="admin-btn admin-btn--ghost min-h-9 px-3 py-1.5 text-xs">
              Tienda
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="admin-btn admin-btn--ghost min-h-9 px-3 py-1.5 text-xs"
            >
              Salir
            </button>
          </div>
        </div>
        <div className="admin-nav__tabs">
          {LINKS.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={'admin-nav__tab' + (active ? ' is-active' : '')}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
