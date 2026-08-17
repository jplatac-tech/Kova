import { NextResponse, type NextRequest } from 'next/server'
import {
  createBrand,
  deleteBrand,
  listBrands,
  updateBrand,
} from '../../../../lib/store'

export async function GET() {
  return NextResponse.json(await listBrands())
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { name?: string; slug?: string }
    if (!body.name) {
      return NextResponse.json({ error: 'name required' }, { status: 400 })
    }
    return NextResponse.json(await createBrand({ name: body.name, slug: body.slug }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      id?: string
      name?: string
      slug?: string
    }
    if (!body.id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }
    return NextResponse.json(
      await updateBrand(body.id, { name: body.name, slug: body.slug }),
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string }
    if (!body.id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }
    await deleteBrand(body.id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
