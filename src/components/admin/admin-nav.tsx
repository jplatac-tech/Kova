'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LOGO_SRC } from '../../lib/constants'

const LINKS = [
  {
    href: '/admin',
    label: 'Inicio',
    hint: 'Resumen',
    icon: HomeIcon,
  },
  {
    href: '/admin/products',
    label: 'Productos',
    hint: 'Stock y precios',
    icon: BoxIcon,
  },
  {
    href: '/admin/brands',
    label: 'Marcas',
    hint: 'Filtros del catálogo',
    icon: TagIcon,
  },
  {
    href: '/admin/settings',
    label: 'Página',
    hint: 'Textos y WhatsApp',
    icon: PageIcon,
  },
  {
    href: '/admin/security',
    label: 'Seguridad',
    hint: 'Acceso admin',
    icon: LockIcon,
  },
] as const

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" strokeLinejoin="round" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M4 8l8-4 8 4-8 4-8-4z" strokeLinejoin="round" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M20 13l-7 7-9-9V4h7l9 9z" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function PageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M7 4h7l5 5v11a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1z" strokeLinejoin="round" />
      <path d="M14 4v5h5M9 13h6M9 17h4" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M4 10l1.2-5h13.6L20 10M4 10v9a1 1 0 001 1h5v-5h4v5h5a1 1 0 001-1v-9M4 10h16" strokeLinejoin="round" />
    </svg>
  )
}

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
    <aside className="admin-nav" aria-label="Admin">
      <div className="admin-nav__inner">
        <Link href="/admin" className="admin-nav__brand">
          <Image
            src={LOGO_SRC}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-black/10"
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">Kova</span>
            <span className="block text-[11px] font-medium text-neutral-500">Panel de control</span>
          </span>
        </Link>

        <nav className="admin-nav__tabs">
          {LINKS.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={'admin-nav__tab' + (active ? ' is-active' : '')}
              >
                <span className="admin-nav__icon">
                  <Icon />
                </span>
                <span className="admin-nav__tab-copy">
                  <span className="admin-nav__tab-label">{item.label}</span>
                  <span className="admin-nav__tab-hint">{item.hint}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="admin-nav__footer">
          <Link href="/" className="admin-nav__footer-link">
            <StoreIcon />
            Tienda
          </Link>
          <button type="button" onClick={() => void logout()} className="admin-nav__footer-link">
            Salir
          </button>
        </div>
      </div>
    </aside>
  )
}
