import Link from 'next/link'
import { DEFAULT_SETTINGS, getSettings, listBrands } from '../../lib/store'
import { buildWhatsAppUrl, formatWhatsAppDisplay } from '../../lib/whatsapp'

export async function SiteFooter() {
  const [settings, brands] = await Promise.all([getSettings(), listBrands()])
  const phoneDisplay = formatWhatsAppDisplay(settings.whatsappNumber)
  const whatsappHref = buildWhatsAppUrl(
    settings.whatsappMessage || DEFAULT_SETTINGS.whatsappMessage,
    settings.whatsappNumber,
  )
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(720px 280px at 12% 0%, rgba(212,196,168,0.28), transparent 55%), radial-gradient(520px 240px at 100% 100%, rgba(37,211,102,0.12), transparent 50%)',
        }}
      />

      <div className="relative">
        <div className="flex gap-8 overflow-hidden border-b border-white/10 py-3 whitespace-nowrap" aria-hidden>
          <div className="footer-marquee flex gap-8 text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
            {['Kova', 'Nike', 'Adidas', 'New Balance', 'Puma', 'Tu par', 'Kova'].map(
              (item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ),
            )}
            {['Kova', 'Nike', 'Adidas', 'New Balance', 'Puma', 'Tu par', 'Kova'].map(
              (item, index) => (
                <span key={`dup-${item}-${index}`} aria-hidden>
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="container grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
              KOVA
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              Zapatos que definen tu estilo. Elige marca, talla y pídelos por
              WhatsApp en minutos.
            </p>
            {settings.footerText ? (
              <p className="mt-3 max-w-md text-sm text-white/55">{settings.footerText}</p>
            ) : null}
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.28)] transition hover:scale-[1.02] hover:bg-[#20bd5a]"
            >
              Escribir por WhatsApp
              {phoneDisplay ? (
                <span className="text-white/80">{phoneDisplay}</span>
              ) : null}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:justify-self-end">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/45 uppercase">
                Catálogo
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/catalogo" className="text-white/80 hover:text-white">
                    Ver todo
                  </Link>
                </li>
                {brands.slice(0, 6).map((brand) => (
                  <li key={brand.id}>
                    <Link
                      href={`/catalogo?marca=${brand.slug}`}
                      className="text-white/80 hover:text-white"
                    >
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/45 uppercase">
                Pedidos
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>
                  <Link href="/carrito" className="hover:text-white">
                    Tu bolsa
                  </Link>
                </li>
                <li>
                  <Link href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    WhatsApp
                  </Link>
                </li>
                <li>Tallas reales</li>
                <li>Stock al día</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Kova. Todos los derechos reservados.</p>
          <p>Hecho para encontrar tu par.</p>
        </div>
      </div>
    </footer>
  )
}
