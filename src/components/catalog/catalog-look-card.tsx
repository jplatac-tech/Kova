'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '../../lib/utils'
import type { CatalogProduct } from '../../lib/store/types'
import { CatalogGalleryMedia } from './catalog-gallery-media'

type Props = {
  product: CatalogProduct
  detailLabel?: string
  imagePriority?: boolean
}

export function CatalogLookCard({
  product,
  detailLabel = 'Ver producto',
  imagePriority = false,
}: Props) {
  const detailHref = `/productos/${product.slug}`
  const galleryImages =
    product.images && product.images.length > 1 ? product.images : null
  const cover = product.images[0] || '/brand/kova-logo.jpg'
  const inStock = product.sizes.some((size) => size.stock > 0)

  return (
    <article
      className={
        'catalog-look-card' + (galleryImages ? ' catalog-look-card--gallery' : '')
      }
    >
      {galleryImages ? (
        <div className="catalog-look-card__media">
          <CatalogGalleryMedia
            images={galleryImages}
            alt={product.name}
            href={detailHref}
            badge={product.badge || product.brandName}
            imagePriority={imagePriority}
          />
        </div>
      ) : (
        <Link href={detailHref} className="catalog-look-card__media">
          <div className="catalog-look-card__media-frame">
            <Image
              src={cover}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 33vw, 300px"
              loading={imagePriority ? 'eager' : 'lazy'}
              priority={imagePriority}
              className="catalog-look-card__img"
            />
            <div className="catalog-look-card__shade" aria-hidden />
            <span className="catalog-look-card__peek">Ver producto →</span>
            {product.badge ? (
              <span className="catalog-look-card__badge">{product.badge}</span>
            ) : (
              <span className="catalog-look-card__badge">{product.brandName}</span>
            )}
          </div>
        </Link>
      )}

      <div className="catalog-look-card__body">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-500 uppercase">
          {product.brandName}
        </p>
        <Link href={detailHref} className="catalog-look-card__title-link">
          <h3 className="catalog-look-card__title">{product.name}</h3>
        </Link>
        <p className="catalog-look-card__desc">{product.description}</p>
        <p className="catalog-look-card__price">{formatPrice(product.price)}</p>
        <p className="text-xs text-neutral-500">
          {inStock ? 'En stock' : 'Agotado'}
        </p>
        <div className="catalog-look-card__actions">
          <Link href={detailHref} className="btn-card btn-card--primary">
            {detailLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
