import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct, listProducts, saveProduct } from '../../../../lib/store'

export async function GET() {
  const products = await listProducts()
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await saveProduct(body)
    return NextResponse.json(product)
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
    await deleteProduct(body.id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
