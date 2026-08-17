'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

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
    <main className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <p className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">
          Kova
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-950">
          Acceso administrador
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Un solo administrador. En producción usa el correo y la contraseña
          configurados en las variables{' '}
          <code className="rounded bg-neutral-100 px-1 text-xs">ADMIN_EMAIL</code>{' '}
          y{' '}
          <code className="rounded bg-neutral-100 px-1 text-xs">ADMIN_PASSWORD</code>,
          o cámbialos luego en Admin → Seguridad.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-neutral-900">
            Correo
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-2"
            />
          </label>
          <label className="block text-sm font-medium text-neutral-900">
            Contraseña
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-2"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending} className="bg-neutral-950 text-white">
            {pending ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/" className="underline">
            Volver a la tienda
          </Link>
        </p>
      </div>
    </main>
  )
}
