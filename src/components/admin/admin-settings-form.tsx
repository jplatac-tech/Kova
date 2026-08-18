'use client'

import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { DEFAULT_SETTINGS, type SiteSettings } from '../../lib/store/types'
import { AdminAlert, AdminCard, AdminField } from './admin-ui'

const SECTIONS = [
  { id: 'seccion-inicio-hero', label: 'Inicio · Hero' },
  { id: 'seccion-inicio-destacados', label: 'Inicio · Destacados' },
  { id: 'seccion-catalogo', label: 'Catálogo' },
  { id: 'seccion-footer', label: 'Pie de página' },
  { id: 'seccion-whatsapp', label: 'WhatsApp' },
] as const

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({
    ...DEFAULT_SETTINGS,
    ...settings,
    whatsappMessage:
      settings.whatsappMessage?.trim() || DEFAULT_SETTINGS.whatsappMessage,
    footerWhatsappMessage: settings.footerWhatsappMessage ?? '',
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

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
      setForm({ ...DEFAULT_SETTINGS, ...json })
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <nav className="admin-jump" aria-label="Secciones de la página">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </nav>

      <AdminCard
        id="seccion-inicio-hero"
        page="Página: Inicio"
        title="Hero"
        description="Primera sección de la portada: textos sobre la imagen principal."
      >
        <div className="space-y-4">
          <AdminField label="Texto pequeño">
            <Input
              value={form.heroEyebrow}
              onChange={(e) => update('heroEyebrow', e.target.value)}
            />
          </AdminField>
          <AdminField label="Título">
            <Input
              value={form.heroTitle}
              onChange={(e) => update('heroTitle', e.target.value)}
            />
          </AdminField>
          <AdminField label="Subtítulo">
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.heroSubtitle}
              onChange={(e) => update('heroSubtitle', e.target.value)}
            />
          </AdminField>
          <AdminField label="Imagen del hero" hint="URL o sube un archivo.">
            <Input
              value={form.heroImage}
              onChange={(e) => update('heroImage', e.target.value)}
              placeholder="https://..."
            />
          </AdminField>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
            <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.heroImage}
                alt="Vista previa del hero"
                className="h-40 w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </AdminCard>

      <AdminCard
        id="seccion-inicio-destacados"
        page="Página: Inicio"
        title="Destacados"
        description="Bloque de productos debajo del hero en la portada."
      >
        <div className="space-y-4">
          <AdminField label="Título">
            <Input
              value={form.featuredTitle}
              onChange={(e) => update('featuredTitle', e.target.value)}
            />
          </AdminField>
          <AdminField label="Descripción">
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.featuredSubtitle}
              onChange={(e) => update('featuredSubtitle', e.target.value)}
            />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard
        id="seccion-catalogo"
        page="Página: Catálogo"
        title="Encabezado"
        description="Título y texto que aparecen arriba de los filtros en /catalogo."
      >
        <div className="space-y-4">
          <AdminField label="Título">
            <Input
              value={form.catalogTitle}
              onChange={(e) => update('catalogTitle', e.target.value)}
            />
          </AdminField>
          <AdminField label="Subtítulo">
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.catalogSubtitle}
              onChange={(e) => update('catalogSubtitle', e.target.value)}
            />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard
        id="seccion-footer"
        page="Todas las páginas"
        title="Pie de página"
        description="Textos del footer compacto y el enlace Contáctanos (WhatsApp de la tienda)."
      >
        <div className="space-y-4">
          <AdminField label="Frase corta">
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.footerTagline}
              onChange={(e) => update('footerTagline', e.target.value)}
            />
          </AdminField>
          <AdminField label="Texto extra (opcional)">
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.footerText}
              onChange={(e) => update('footerText', e.target.value)}
            />
          </AdminField>
          <AdminField
            label="Etiqueta de contacto"
            hint="Ejemplo: Contáctanos. Abre el WhatsApp de la tienda."
          >
            <Input
              value={form.footerContactLabel}
              onChange={(e) => update('footerContactLabel', e.target.value)}
              placeholder="Contáctanos"
            />
          </AdminField>
          <AdminField
            label="Mensaje de WhatsApp del pie"
            hint="Déjalo vacío para abrir el chat sin texto. Este mensaje es solo del footer, no del carrito."
          >
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.footerWhatsappMessage}
              onChange={(e) => update('footerWhatsappMessage', e.target.value)}
              placeholder="Sin mensaje predeterminado"
            />
          </AdminField>
          {form.footerWhatsappMessage.trim() ? (
            <p className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-sm whitespace-pre-wrap text-neutral-600">
              <span className="font-semibold text-neutral-800">Vista previa: </span>
              {form.footerWhatsappMessage}
            </p>
          ) : (
            <p className="text-sm text-neutral-500">
              Sin mensaje: el cliente abre WhatsApp en blanco.
            </p>
          )}
          <AdminField label="Crédito inferior (opcional)">
            <Input
              value={form.footerCredit}
              onChange={(e) => update('footerCredit', e.target.value)}
            />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard
        id="seccion-whatsapp"
        page="Toda la tienda"
        title="WhatsApp"
        description="Número de la tienda y el mensaje de consulta de productos (catálogo, ficha y botón flotante)."
      >
        <div className="space-y-4">
          <AdminField
            label="Número (con código de país, sin +)"
            hint="Ejemplo Colombia: 57321…"
          >
            <Input
              value={form.whatsappNumber}
              onChange={(e) => update('whatsappNumber', e.target.value)}
              placeholder="573216678821"
              inputMode="tel"
            />
          </AdminField>
          <AdminField
            label="Mensaje de consulta de un producto"
            hint="Usa {producto} si quieres que se inserte el nombre del modelo. Si no lo pones, el modelo se añade al final cuando aplica."
          >
            <textarea
              className="admin-textarea"
              rows={5}
              value={form.whatsappMessage}
              onChange={(e) => update('whatsappMessage', e.target.value)}
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
