import { NextResponse, type NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'
import {
  getSupabaseAdmin,
  PRODUCT_IMAGES_BUCKET,
} from '../../../../lib/supabase'

async function uploadToSupabase(file: File, bytes: Buffer) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '') || 'imagen.jpg'
  const path = `products/${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

  if (error) {
    // Bucket may not exist yet — create and retry once
    if (error.message.toLowerCase().includes('bucket')) {
      await supabase.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
        public: true,
        fileSizeLimit: 6 * 1024 * 1024,
      })
      const retry = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, bytes, {
          contentType: file.type || 'image/jpeg',
          upsert: false,
        })
      if (retry.error) throw new Error(retry.error.message)
    } else {
      throw new Error(error.message)
    }
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path)
  return data.publicUrl
}

async function uploadLocal(file: File, bytes: Buffer) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '')
  const name = `${Date.now()}-${safeName || 'imagen.jpg'}`
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  await fs.writeFile(join(uploadsDir, name), bytes)
  return `/uploads/${name}`
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file required' }, { status: 400 })
    }
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen supera 6 MB' },
        { status: 400 },
      )
    }

    const bytes = Buffer.from(await file.arrayBuffer())

    try {
      const supabaseUrl = await uploadToSupabase(file, bytes)
      if (supabaseUrl) {
        return NextResponse.json({ url: supabaseUrl })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'supabase_upload_failed'
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: message }, { status: 400 })
      }
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error:
            'Configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para subir imágenes en Vercel.',
        },
        { status: 400 },
      )
    }

    const url = await uploadLocal(file, bytes)
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: 'upload_failed' }, { status: 400 })
  }
}
