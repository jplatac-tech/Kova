import Link from 'next/link'
import { DEFAULT_SETTINGS, getSettings } from '../../lib/store'
import { buildWhatsAppUrl, formatWhatsAppDisplay } from '../../lib/whatsapp'

export async function SiteFooter() {
  const settings = await getSettings()
  const phoneDisplay = formatWhatsAppDisplay(settings.whatsappNumber)
  const contactHref = buildWhatsAppUrl(
    settings.footerWhatsappMessage,
    settings.whatsappNumber,
  )
  const contactLabel =
    settings.footerContactLabel.trim() || DEFAULT_SETTINGS.footerContactLabel
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      <div className="container flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">Kova</p>
          {settings.footerTagline ? (
            <p className="mt-0.5 max-w-md text-xs leading-relaxed text-white/55">
              {settings.footerTagline}
            </p>
          ) : null}
          {settings.footerText ? (
            <p className="mt-1 max-w-md text-xs leading-relaxed text-white/45">
              {settings.footerText}
            </p>
          ) : null}
        </div>

        <nav
          aria-label="Pie de página"
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-white/70"
        >
          <Link href="/catalogo" className="hover:text-white">
            Catálogo
          </Link>
          <Link href="/carrito" className="hover:text-white">
            Bolsa
          </Link>
          <Link
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {contactLabel}
            {phoneDisplay ? (
              <span className="ml-1 text-white/45">{phoneDisplay}</span>
            ) : null}
          </Link>
        </nav>
      </div>

      <div className="container flex flex-col gap-1 border-t border-white/10 py-3 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Kova. Todos los derechos reservados.</p>
        {settings.footerCredit ? <p>{settings.footerCredit}</p> : null}
      </div>
    </footer>
  )
}
