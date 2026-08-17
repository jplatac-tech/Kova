import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { HideOnAdmin } from '../components/layout/hide-on-admin'
import { SiteFooter } from '../components/layout/site-footer'
import { SiteHeader } from '../components/layout/site-header'
import { ClientLayoutExtras } from '../components/layout/client-layout-extras'
import { AppStateProvider } from '../components/app-state/app-state-provider'
import { APP_NAME } from '../lib/constants'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'Kova — tienda de zapatos. Nike, Adidas, New Balance y más. Catálogo, tallas y pedidos por WhatsApp.',
  applicationName: APP_NAME,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body className={`${outfit.className} flex min-h-dvh flex-col`}>
        <AppStateProvider>
          <ClientLayoutExtras />
          <HideOnAdmin>
            <SiteHeader />
          </HideOnAdmin>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          <HideOnAdmin includeLogin>
            <SiteFooter />
          </HideOnAdmin>
        </AppStateProvider>
      </body>
    </html>
  )
}
