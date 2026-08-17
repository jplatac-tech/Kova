import { NextResponse, type NextRequest } from 'next/server'
import { getSettings, updateSettings } from '../../../../lib/store'

export async function GET() {
  return NextResponse.json(await getSettings())
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json(await updateSettings(body))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
