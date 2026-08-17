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
          ['heroImage', 'URL de la imagen del hero'],
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
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-green-700">Guardado.</p> : null}
      <Button type="submit" disabled={pending} className="bg-neutral-950 text-white">
        {pending ? 'Guardando…' : 'Guardar configuración'}
      </Button>
    </form>
  )
}
