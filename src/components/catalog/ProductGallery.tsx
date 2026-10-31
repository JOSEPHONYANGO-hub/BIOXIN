'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { ProductImage } from '@/lib/catalog'
import { cx } from '../ui'

/** Main packshot with thumbnails underneath when there is more than one image. */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface p-12">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo */}
        <img src="/images/logo.svg" alt={`Bioxcin ${name}`} className="w-3/4 max-w-72 opacity-80" />
      </div>
    )
  }

  const main = images[active]
  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">
        <Image src={main.src} alt={main.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain" />
      </div>
      {images.length > 1 ? (
        <ul className="mt-4 flex gap-3" aria-label="Product images">
          {images.map((im, i) => (
            <li key={im.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                className={cx(
                  'relative block size-20 overflow-hidden rounded-lg border-2 bg-white transition-colors sm:size-24',
                  i === active ? 'border-brand' : 'border-line hover:border-muted',
                )}
              >
                <Image src={im.src} alt="" fill sizes="96px" className="object-contain" />
                <span className="sr-only">
                  Show image {i + 1}: {im.alt}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
