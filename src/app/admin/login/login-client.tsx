'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { AdminAlert, AdminField } from '../../../components/admin/admin-ui'

export function AdminLoginClient({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'No se pudo iniciar sesión')
        return
      }
      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Error de red')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="admin-card admin-rise w-full max-w-md">
        <div className="admin-card__body p-6 sm:p-8">
          <p className="admin-eyebrow">Kova</p>
          <h1 className="admin-title text-[1.5rem]">Acceso administrador</h1>
          <p className="admin-lead">
            Un solo administrador. En producción usa el correo y la contraseña
            configurados, o cámbialos luego en Seguridad.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <AdminField label="Correo">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </AdminField>
            <AdminField label="Contraseña">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </AdminField>
            {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
            <Button type="submit" disabled={pending} className="admin-btn--block">
              {pending ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-neutral-500">
            <Link href="/" className="font-medium underline-offset-2 hover:underline">
              Volver a la tienda
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
