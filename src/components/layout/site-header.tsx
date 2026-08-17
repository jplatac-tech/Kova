'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CartHeaderTrigger } from '../cart/cart-header-trigger'
import { LOGO_SRC } from '../../lib/constants'

const NAV_LINKS = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/carrito', label: 'Carrito' },
] as const

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      )}
    </svg>
  )
}

function isNavActive(pathname: string, href: string) {
  if (href === '/catalogo') return pathname === '/catalogo' || pathname.startsWith('/productos/')
  return pathname === href
}

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white pt-[env(safe-area-inset-top,0px)] text-neutral-900 shadow-sm">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex h-16 min-h-[64px] items-center justify-between gap-4 sm:h-[72px]">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Kova — inicio"
          >
            <Image
              src={LOGO_SRC}
              alt="Kova"
              width={72}
              height={72}
              className="h-14 w-14 rounded-full object-cover shadow-sm ring-1 ring-[var(--border)] sm:h-16 sm:w-16"
              priority
            />
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Principal">
              {NAV_LINKS.map((item) => {
                const active = isNavActive(pathname, item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition ' +
                      (active
                        ? 'bg-[var(--surface-muted)] text-neutral-950'
                        : 'text-neutral-800 hover:bg-[var(--surface-muted)]')
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <CartHeaderTrigger />

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-100 lg:hidden sm:h-10 sm:w-10"
              aria-expanded={menuOpen}
              aria-controls="site-mobile-nav"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[250] lg:hidden" role="presentation">
              <button
                type="button"
                className="absolute inset-0 bg-neutral-950/50"
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
              />
              <nav
                id="site-mobile-nav"
                className="absolute right-0 bottom-0 left-0 z-10 flex flex-col overflow-hidden rounded-t-[1.35rem] border-t border-[var(--border)] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.2)]"
                style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
                aria-label="Menú móvil"
              >
                <div className="flex justify-center pt-3 pb-1" aria-hidden>
                  <div className="h-1 w-10 rounded-full bg-neutral-300" />
                </div>
                <ul className="p-2" role="list">
                  {NAV_LINKS.map((item) => {
                    const active = isNavActive(pathname, item.href)
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={
                            'flex min-h-[48px] items-center rounded-xl px-4 text-sm font-semibold ' +
                            (active ? 'bg-[var(--surface-muted)]' : 'hover:bg-neutral-50')
                          }
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  )
}
