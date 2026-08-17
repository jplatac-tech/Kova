import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings } from '../../lib/store'

export function HomeHero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative min-h-[min(calc(100svh-var(--header-height)),720px)] w-full overflow-hidden bg-[#cbb896]">
      {settings.heroImage ? (
        <Image
          src={settings.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[min(calc(100svh-var(--header-height)),720px)] items-end">
        <div className="container pb-12 sm:pb-16 md:pb-20">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-white/85 uppercase sm:text-[11px]">
            {settings.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            {settings.heroTitle}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {settings.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 hover:bg-[var(--sand)]"
            >
              Ver catálogo
            </Link>
            <Link
              href="/catalogo?marca=nike"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-white/70 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              Nike
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
