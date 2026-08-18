'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../../drive-upload-db-fix/src/components/ui/input'
import { Button } from '../../../drive-upload-db-fix/src/components/ui/button'
import type { Brand, CatalogProduct, ProductSize } from '../../lib/store/types'
import { DEFAULT_SHOE_SIZES } from '../../lib/store/types'
import { AdminAlert, AdminCard, AdminField } from './admin-ui'

type FormState = {
  id?: string
  name: string
  slug: string
  description: string
  price: number
  brandId: string
  images: string[]
  badge: string
  featured: boolean
  isActive: boolean
  sizes: ProductSize[]
}

function emptyForm(brands: Brand[]): FormState {
  return {
    name: '',
    slug: '',
    description: '',
    price: 0,
    brandId: brands[0]?.id ?? '',
    images: [],
    badge: '',
    featured: false,
    isActive: true,
    sizes: DEFAULT_SHOE_SIZES.map((label) => ({ label, stock: 0 })),
  }
}

export function AdminProductForm({
  product,
  brands,
}: {
  product?: CatalogProduct | null
  brands: Brand[]
}) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() =>
    product
      ? {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          brandId: product.brandId,
          images: product.images,
          badge: product.badge ?? '',
          featured: product.featured,
          isActive: product.isActive,
          sizes:
            product.sizes.length > 0
              ? product.sizes
              : DEFAULT_SHOE_SIZES.map((label) => ({ label, stock: 0 })),
        }
      : emptyForm(brands),
  )
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product) return
    setForm((current) => ({
      ...current,
      brandId: current.brandId || brands[0]?.id || '',
    }))
  }, [brands, product])

  async function uploadFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      const data = new FormData()
      data.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data })
      const json = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !json.url) throw new Error(json.error ?? 'No se pudo subir')
      setForm((current) => ({ ...current, images: [...current.images, json.url!] }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'No se pudo guardar')
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminCard title="Datos del producto" description="Lo que ve el cliente en el catálogo.">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Nombre">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </AdminField>
          <AdminField label="URL (slug)" hint="Si lo dejas vacío, se genera del nombre.">
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="air-force-1"
            />
          </AdminField>
          <AdminField label="Descripción" className="md:col-span-2">
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </AdminField>
          <AdminField label="Precio (COP)">
            <Input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
          </AdminField>
          <AdminField label="Marca">
            <select
              className="admin-select"
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
              required
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Etiqueta" hint="Opcional. Ej. Nuevo, Popular.">
            <Input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="Nuevo"
            />
          </AdminField>
          <div className="flex flex-col gap-3 pt-1 text-sm sm:flex-row sm:items-center sm:gap-8">
            <label className="flex items-center gap-2.5 font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Destacado en inicio
            </label>
            <label className="flex items-center gap-2.5 font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Visible en catálogo
            </label>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Imágenes" description="Sube archivos o pega una URL.">
        <div className="flex flex-wrap gap-3">
          {form.images.map((src) => (
            <div
              key={src}
              className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[var(--border)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-sm text-white"
                onClick={() =>
                  setForm({
                    ...form,
                    images: form.images.filter((image) => image !== src),
                  })
                }
                aria-label="Quitar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Pega una URL de imagen"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (!imageUrl.trim()) return
              setForm({ ...form, images: [...form.images, imageUrl.trim()] })
              setImageUrl('')
            }}
          >
            Añadir URL
          </Button>
          <label className="admin-btn admin-btn--secondary cursor-pointer">
            {uploading ? 'Subiendo…' : 'Subir archivo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void uploadFile(file)
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Tallas y existencias">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="admin-hint m-0">Talla a la izquierda, unidades a la derecha.</p>
          <Button
            type="button"
            variant="ghost"
            className="min-h-9 px-3 py-1.5 text-xs"
            onClick={() =>
              setForm({
                ...form,
                sizes: [...form.sizes, { label: '', stock: 0 }],
              })
            }
          >
            Añadir talla
          </Button>
        </div>
        <div className="space-y-2">
          {form.sizes.map((size, index) => (
            <div
              key={`${size.label}-${index}`}
              className="grid grid-cols-[1fr_1fr_auto] items-center gap-2"
            >
              <Input
                value={size.label}
                onChange={(e) => {
                  const sizes = [...form.sizes]
                  sizes[index] = { ...sizes[index], label: e.target.value }
                  setForm({ ...form, sizes })
                }}
                placeholder="Talla"
                aria-label="Talla"
              />
              <Input
                type="number"
                min={0}
                value={size.stock}
                onChange={(e) => {
                  const sizes = [...form.sizes]
                  sizes[index] = {
                    ...sizes[index],
                    stock: Number(e.target.value),
                  }
                  setForm({ ...form, sizes })
                }}
                placeholder="Stock"
                aria-label="Existencias"
              />
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 px-3"
                onClick={() =>
                  setForm({
                    ...form,
                    sizes: form.sizes.filter((_, i) => i !== index),
                  })
                }
              >
                Quitar
              </Button>
            </div>
          ))}
        </div>
      </AdminCard>

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="admin-sticky-actions">
        <Button type="submit" disabled={pending} className="admin-btn--block">
          {pending ? 'Guardando…' : 'Guardar producto'}
        </Button>
      </div>
    </form>
  )
}
