import { NextResponse } from 'next/server'
import { getSettings } from '../../../../lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json({
    whatsappNumber: settings.whatsappNumber,
    whatsappMessage: settings.whatsappMessage,
    footerText: settings.footerText,
  })
}
