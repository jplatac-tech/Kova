'use client'

import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <label className="block text-sm font-medium">
        Correo administrador
        <Input
          className="mt-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm font-medium">
        Nueva contraseña (opcional)
        <Input
          className="mt-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />
      </label>
      <label className="block text-sm font-medium">
        Confirmar nueva contraseña
        <Input
          className="mt-2"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite la contraseña"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-green-700">Credenciales actualizadas.</p> : null}
      <Button type="submit" disabled={pending} className="bg-neutral-950 text-white">
        {pending ? 'Guardando…' : 'Guardar credenciales'}
      </Button>
    </form>
  )
}
