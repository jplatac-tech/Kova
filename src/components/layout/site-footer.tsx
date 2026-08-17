import Image from 'next/image'
import Link from 'next/link'
import { LOGO_SRC } from '../../lib/constants'
import { getSettings } from '../../lib/store'
import { formatWhatsAppDisplay } from '../../lib/whatsapp'

export async function SiteFooter() {
  const settings = await getSettings()
  const phoneDisplay = formatWhatsAppDisplay(settings.whatsappNumber)

  return (
    <footer className="border-t border-[var(--border)] bg-white py-10">
      <div className="container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={LOGO_SRC}
            alt="Kova"
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-cover ring-1 ring-[var(--border)] sm:h-16 sm:w-16"
          />
          {settings.footerText ? (
            <p className="max-w-md text-sm text-neutral-600">{settings.footerText}</p>
          ) : null}
        </div>
        <div className="text-sm text-neutral-600">
          <Link href="/catalogo" className="font-medium text-neutral-900 hover:underline">
            Catálogo
          </Link>
          {phoneDisplay ? <p className="mt-2">{phoneDisplay}</p> : null}
        </div>
      </div>
    </footer>
  )
}
