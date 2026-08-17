'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import type { Brand, CatalogProduct, ProductSize } from '../../lib/store/types'
import { DEFAULT_SHOE_SIZES } from '../../lib/store/types'

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

  useEffect(() => {
    if (product) return
    setForm((current) => ({
      ...current,
      brandId: current.brandId || brands[0]?.id || '',
    }))
  }, [brands, product])

  async function uploadFile(file: File) {
    const data = new FormData()
    data.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: data })
    const json = (await res.json()) as { url?: string; error?: string }
    if (!res.ok || !json.url) throw new Error(json.error ?? 'No se pudo subir')
    setForm((current) => ({ ...current, images: [...current.images, json.url!] }))
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Nombre
          <Input
            className="mt-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="text-sm font-medium">
          URL (slug)
          <Input
            className="mt-2"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="se genera del nombre si lo dejas vacío"
          />
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Descripción
          <textarea
            className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="text-sm font-medium">
          Precio (COP)
          <Input
            className="mt-2"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
        </label>
        <label className="text-sm font-medium">
          Marca
          <select
            className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm"
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
        </label>
        <label className="text-sm font-medium">
          Etiqueta (opcional)
          <Input
            className="mt-2"
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            placeholder="Nuevo, Popular…"
          />
        </label>
        <div className="flex items-center gap-6 pt-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Destacado en inicio
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Visible en catálogo
          </label>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-semibold">Imágenes</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {form.images.map((src) => (
            <div key={src} className="relative h-24 w-24 overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 rounded-full bg-black/70 px-1.5 text-xs text-white"
                onClick={() =>
                  setForm({
                    ...form,
                    images: form.images.filter((image) => image !== src),
                  })
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
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
          <label className="btn btn-secondary cursor-pointer">
            Subir archivo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void uploadFile(file)
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tallas y existencias</h2>
          <Button
            type="button"
            variant="ghost"
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
        <div className="mt-3 space-y-2">
          {form.sizes.map((size, index) => (
            <div key={`${size.label}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input
                value={size.label}
                onChange={(e) => {
                  const sizes = [...form.sizes]
                  sizes[index] = { ...sizes[index], label: e.target.value }
                  setForm({ ...form, sizes })
                }}
                placeholder="40"
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
              />
              <Button
                type="button"
                variant="ghost"
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
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={pending} className="bg-neutral-950 text-white">
        {pending ? 'Guardando…' : 'Guardar producto'}
      </Button>
    </form>
  )
}
