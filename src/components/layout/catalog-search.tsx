'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? 'h-5 w-5'}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  )
}

export function CatalogSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setValue(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function applyQuery(next: string) {
    const query = next.trim()
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : searchParams.toString(),
    )
    if (query) params.set('q', query)
    else params.delete('q')
    const qs = params.toString()
    const href = qs ? `/catalogo?${qs}` : '/catalogo'
    if (pathname === '/catalogo') {
      router.replace(href, { scroll: false })
    } else {
      router.push(href)
    }
  }

  useEffect(() => {
    if (pathname !== '/catalogo') return
    const current = (searchParams.get('q') || '').trim()
    if (current === value.trim()) return
    const timer = window.setTimeout(() => applyQuery(value), 350)
    return () => window.clearTimeout(timer)
  }, [value, pathname, searchParams, router])

  function goToSearch(next: string) {
    applyQuery(next)
    setOpen(false)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    goToSearch(value)
  }

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end lg:justify-start">
      <form
        onSubmit={onSubmit}
        className="relative hidden w-full max-w-xl lg:block"
        role="search"
      >
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar por nombre"
          aria-label="Buscar zapatos por nombre"
          autoComplete="off"
          className="h-10 w-full rounded-full border border-[var(--border)] bg-[var(--surface-muted)] pr-4 pl-10 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-neutral-900 focus:bg-white"
        />
      </form>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-100 lg:hidden sm:h-10 sm:w-10"
        aria-label="Buscar por nombre"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-0 z-20 flex h-16 items-center gap-2 bg-white px-4 sm:h-[72px] sm:px-8 lg:hidden">
          <form onSubmit={onSubmit} className="relative min-w-0 flex-1" role="search">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Buscar por nombre"
              aria-label="Buscar zapatos por nombre"
              autoComplete="off"
              className="h-10 w-full rounded-full border border-[var(--border)] bg-[var(--surface-muted)] pr-4 pl-10 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-900 focus:bg-white"
            />
          </form>
          <button
            type="button"
            className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </button>
        </div>
      ) : null}
    </div>
  )
}
