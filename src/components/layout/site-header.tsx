'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { CartHeaderTrigger } from '../cart/cart-header-trigger'
import { LOGO_SRC } from '../../lib/constants'
import { CatalogSearch } from './catalog-search'

function isCatalogActive(pathname: string) {
  return pathname === '/catalogo' || pathname.startsWith('/productos/')
}

function SearchFallback() {
  return <div className="hidden h-10 min-w-0 flex-1 rounded-full bg-[var(--surface-muted)] lg:block" />
}

export function SiteHeader() {
  const pathname = usePathname()
  const catalogActive = isCatalogActive(pathname)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 pt-[env(safe-area-inset-top,0px)] text-neutral-900 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 min-h-[64px] items-center gap-2 sm:h-[72px] sm:gap-4">
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
              className="h-11 w-11 rounded-full object-cover shadow-sm ring-1 ring-[var(--border)] sm:h-14 sm:w-14"
              priority
            />
          </Link>

          <Link
            href="/catalogo"
            aria-current={catalogActive ? 'page' : undefined}
            className={
              'shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition sm:px-3.5 ' +
              (catalogActive
                ? 'bg-[var(--surface-muted)] text-neutral-950'
                : 'text-neutral-800 hover:bg-[var(--surface-muted)]')
            }
          >
            Catálogo
          </Link>

          <Suspense fallback={<SearchFallback />}>
            <CatalogSearch />
          </Suspense>

          <CartHeaderTrigger />
        </div>
      </div>
    </header>
  )
}
