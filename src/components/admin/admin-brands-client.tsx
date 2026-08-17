'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import type { Brand } from '../../lib/store'

export function AdminBrandsClient({ brands }: { brands: Brand[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'No se pudo crear')
      setName('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setPending(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar esta marca?')) return
    const res = await fetch('/api/admin/brands', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const json = await res.json()
    if (!res.ok) {
      alert(json.error ?? 'No se pudo eliminar')
      return
    }
    router.refresh()
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={create} className="space-y-3">
        <label className="block text-sm font-medium">
          Nueva marca
          <Input
            className="mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nike, Adidas…"
            required
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={pending} className="bg-neutral-950 text-white">
          Crear filtro
        </Button>
      </form>
      <div className="space-y-2">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          >
            <div>
              <p className="font-semibold">{brand.name}</p>
              <p className="text-xs text-neutral-500">{brand.slug}</p>
            </div>
            <button
              type="button"
              onClick={() => void remove(brand.id)}
              className="text-sm font-semibold text-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
