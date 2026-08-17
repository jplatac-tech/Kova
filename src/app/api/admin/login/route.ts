import { NextResponse } from 'next/server'
import { verifyAdminPassword } from '../../../../lib/admin-credentials'
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  signAdminSession,
} from '../../../../lib/admin-session'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim()
    const password = body.password ?? ''
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Correo y contraseña requeridos' },
        { status: 400 },
      )
    }

    if (!(await verifyAdminPassword(email, password))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const token = await signAdminSession(email)
    if (!token) {
      return NextResponse.json(
        { error: 'ADMIN_SESSION_SECRET no configurado' },
        { status: 500 },
      )
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions())
    return res
  } catch {
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}
