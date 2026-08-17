import { NextResponse, type NextRequest } from 'next/server'
import {
  getConfiguredAdminEmail,
  updateAdminCredentials,
} from '../../../../lib/admin-credentials'

export async function GET() {
  const email = await getConfiguredAdminEmail()
  return NextResponse.json({ email })
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
      confirmPassword?: string
    }
    const email = body.email?.trim()
    const password = body.password?.trim()
    const confirmPassword = body.confirmPassword?.trim()

    if (!email && !password) {
      return NextResponse.json(
        { error: 'Debes cambiar correo o contraseña.' },
        { status: 400 },
      )
    }

    if (password && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'La confirmación de contraseña no coincide.' },
        { status: 400 },
      )
    }

    const updated = await updateAdminCredentials({ email, password })
    return NextResponse.json(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
