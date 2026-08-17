'use client'

import { useState } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import type { SiteSettings } from '../../lib/store'

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)

  async function uploadHero(file: File) {
    setUploadingHero(true)
    setError(null)
    try {
      const data = new FormData()
      data.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data })
      const json = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? 'No se pudo subir la imagen')
      }
      setForm((current) => ({ ...current, heroImage: json.url! }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen')
    } finally {
      setUploadingHero(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'No se pudo guardar')
      setForm(json)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <label className="block text-sm font-medium">
        Número de WhatsApp (con código de país, sin +)
        <Input
          className="mt-2"
          value={form.whatsappNumber}
          onChange={(e) =>
            setForm({ ...form, whatsappNumber: e.target.value })
          }
          placeholder="573216678821"
          inputMode="tel"
        />
        <span className="mt-1 block text-xs font-normal text-neutral-500">
          Ahí llegan los mensajes del botón flotante, del carrito y de cada
          producto. Ejemplo Colombia: 57321…
        </span>
      </label>

      {(
        [
          ['heroEyebrow', 'Texto pequeño del hero'],
          ['heroTitle', 'Título principal'],
          ['heroSubtitle', 'Subtítulo'],
          ['catalogTitle', 'Título del catálogo'],
          ['catalogSubtitle', 'Subtítulo del catálogo'],
          ['footerText', 'Texto del pie (opcional)'],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block text-sm font-medium">
          {label}
          {key === 'heroSubtitle' || key === 'footerText' ? (
            <textarea
              className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm"
              rows={3}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ) : (
            <Input
              className="mt-2"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          )}
        </label>
      ))}

      <label className="block text-sm font-medium">
        URL de la imagen del hero
        <Input
          className="mt-2"
          value={form.heroImage}
          onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
          placeholder="https://..."
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="btn btn-secondary cursor-pointer">
          {uploadingHero ? 'Subiendo…' : 'Subir imagen del hero'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingHero}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadHero(file)
              e.target.value = ''
            }}
          />
        </label>
        <span className="text-xs text-neutral-500">
          Si subes archivo, reemplazamos automáticamente la URL.
        </span>
      </div>

      {form.heroImage ? (
        <div className="max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={form.heroImage} alt="Vista previa del hero" className="h-40 w-full object-cover" />
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-green-700">Guardado.</p> : null}
      <Button type="submit" disabled={pending} className="bg-neutral-950 text-white">
        {pending ? 'Guardando…' : 'Guardar configuración'}
      </Button>
    </form>
  )
}
