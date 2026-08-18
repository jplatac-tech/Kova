'use client'

import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { DEFAULT_SETTINGS, type SiteSettings } from '../../lib/store'
import { AdminAlert, AdminCard, AdminField } from './admin-ui'

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({
    ...DEFAULT_SETTINGS,
    ...settings,
    whatsappMessage:
      settings.whatsappMessage?.trim() || DEFAULT_SETTINGS.whatsappMessage,
  })
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
      <AdminCard
        title="WhatsApp"
        description="Número y texto que se abre cuando un cliente escribe desde la tienda."
      >
        <div className="space-y-4">
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
          <AdminField
            label="Mensaje que llega a WhatsApp"
            hint="Usa {producto} si quieres que se inserte el nombre del modelo. Si no lo pones, el modelo se añade al final cuando aplica."
          >
            <textarea
              className="admin-textarea"
              rows={5}
              value={form.whatsappMessage}
              onChange={(e) =>
                setForm({ ...form, whatsappMessage: e.target.value })
              }
              placeholder="¡Hola! Quiero información sobre un modelo de Kova."
            />
          </AdminField>
          {form.whatsappMessage.trim() ? (
            <p className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-sm whitespace-pre-wrap text-neutral-600">
              <span className="font-semibold text-neutral-800">Vista previa: </span>
              {form.whatsappMessage.replaceAll('{producto}', 'Nike Dunk Low')}
            </p>
          ) : null}
        </div>
      </AdminCard>

      <AdminCard title="Hero y pie">
        <div className="space-y-4">
          {(
            [
              ['heroEyebrow', 'Texto pequeño del hero'],
              ['heroTitle', 'Título principal'],
              ['heroSubtitle', 'Subtítulo'],
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
