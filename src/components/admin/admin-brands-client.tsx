'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import type { Brand } from '../../lib/store'
import { ConfirmModal } from '../../components/ui/confirm-modal'
import { AdminAlert, AdminCard, AdminEmpty, AdminField } from '../../components/admin/admin-ui'

export function AdminBrandsClient({ brands }: { brands: Brand[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)

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
    const res = await fetch('/api/admin/brands', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const json = await res.json()
    setPendingId(null)
    if (!res.ok) {
      setError(json.error ?? 'No se pudo eliminar')
      return
    }
    router.refresh()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <AdminCard title="Nueva marca" description="Se usará como filtro del catálogo.">
        <form onSubmit={create} className="space-y-3">
          <AdminField label="Nombre">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nike, Adidas…"
              required
            />
          </AdminField>
          {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
          <Button type="submit" disabled={pending} className="admin-btn--block">
            {pending ? 'Creando…' : 'Crear marca'}
          </Button>
        </form>
      </AdminCard>

      <AdminCard title="Marcas actuales">
        {brands.length === 0 ? (
          <AdminEmpty
            title="Sin marcas"
            description="Crea la primera para poder añadir productos."
          />
        ) : (
          <div className="space-y-2">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="admin-row flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{brand.name}</p>
                  <p className="text-xs text-neutral-500">{brand.slug}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingId(brand.id)}
                  className="admin-btn admin-btn--ghost min-h-9 px-3 py-1.5 text-xs text-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <ConfirmModal
        open={Boolean(pendingId)}
        title="Eliminar marca"
        description="Solo se puede si no hay productos asociados."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        tone="danger"
        onConfirm={() => {
          if (pendingId) void remove(pendingId)
        }}
        onCancel={() => setPendingId(null)}
      />
    </div>
  )
}
