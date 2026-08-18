'use client'

import { useState } from 'react'
import { Input } from '../../../drive-upload-db-fix/src/components/ui/input'
import { Button } from '../../../drive-upload-db-fix/src/components/ui/button'
import { AdminAlert, AdminCard, AdminField } from './admin-ui'

export function AdminSecurityForm({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState(currentEmail)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: password || undefined,
          confirmPassword: confirmPassword || undefined,
        }),
      })
      const json = (await res.json()) as { email?: string; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'No se pudo actualizar')
      setEmail(json.email ?? email)
      setPassword('')
      setConfirmPassword('')
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
      <AdminCard
        title="Acceso administrador"
        description="Déjala en blanco la contraseña si solo quieres cambiar el correo."
      >
        <div className="space-y-4">
          <AdminField label="Correo administrador">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </AdminField>
          <AdminField label="Nueva contraseña" hint="Mínimo 8 caracteres. Opcional.">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </AdminField>
          <AdminField label="Confirmar nueva contraseña">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </AdminField>
        </div>
      </AdminCard>
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {saved ? <AdminAlert tone="success">Credenciales actualizadas.</AdminAlert> : null}
      <div className="admin-sticky-actions">
        <Button type="submit" disabled={pending} className="admin-btn--block">
          {pending ? 'Guardando…' : 'Guardar credenciales'}
        </Button>
      </div>
    </form>
  )
}
