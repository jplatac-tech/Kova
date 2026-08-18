'use client'

import { useState } from 'react'
import { Input } from '../../../drive-upload-db-fix/src/components/ui/input'
import { Button } from '../../../drive-upload-db-fix/src/components/ui/button'
import type { SiteSettings } from '../../lib/store'
import { AdminAlert, AdminCard, AdminField } from './admin-ui'

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminCard title="WhatsApp" description="Ahí llegan los mensajes de la tienda.">
        <AdminField
          label="Número (con código de país, sin +)"
          hint="Ejemplo Colombia: 57321…"
        >
          <Input
            value={form.whatsappNumber}
            onChange={(e) =>
              setForm({ ...form, whatsappNumber: e.target.value })
            }
            placeholder="573216678821"
            inputMode="tel"
          />
        </AdminField>
      </AdminCard>

      <AdminCard title="Hero y catálogo">
        <div className="space-y-4">
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
            <AdminField key={key} label={label}>
              {key === 'heroSubtitle' || key === 'footerText' ? (
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ) : (
                <Input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              )}
            </AdminField>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Imagen del hero">
        <AdminField label="URL de la imagen">
          <Input
            value={form.heroImage}
            onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
            placeholder="https://..."
          />
        </AdminField>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="admin-btn admin-btn--secondary cursor-pointer">
            {uploadingHero ? 'Subiendo…' : 'Subir imagen'}
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
          <span className="admin-hint">Si subes archivo, reemplaza la URL.</span>
        </div>
        {form.heroImage ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.heroImage} alt="Vista previa del hero" className="h-40 w-full object-cover" />
          </div>
        ) : null}
      </AdminCard>

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {saved ? <AdminAlert tone="success">Guardado.</AdminAlert> : null}

      <div className="admin-sticky-actions">
        <Button type="submit" disabled={pending} className="admin-btn--block">
          {pending ? 'Guardando…' : 'Guardar configuración'}
        </Button>
      </div>
    </form>
  )
}
