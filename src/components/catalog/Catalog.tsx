import Image from 'next/image'
import Link from 'next/link'
import type { Accent, Category, Family, Product } from '@/lib/catalog'
import { familyOf, productHref } from '@/lib/catalog'
import { buyLink } from '@/lib/site'
import { buttonStyles, cx } from '../ui'

/** Family accent colours from the brand identity document, with AA-safe text shades. */
export const accentStyles: Record<Accent, { bar: string; text: string; tint: string }> = {
  brand: { bar: 'bg-brand', text: 'text-brand', tint: 'from-surface to-accent/15' },
  forte: { bar: 'bg-forte', text: 'text-forte', tint: 'from-surface to-forte/10' },
  collagen: { bar: 'bg-collagen', text: 'text-collagen', tint: 'from-surface to-collagen/10' },
  keratin: { bar: 'bg-keratin', text: 'text-keratin-ink', tint: 'from-surface to-keratin/20' },
  hydra: { bar: 'bg-hydra', text: 'text-hydra-ink', tint: 'from-surface to-hydra/15' },
}

/**
 * Product packaging image (4:5). Until the approved photos are added in Phase 3 this renders a
 * neutral, clearly labelled placeholder instead of a stock or invented image.
 */
export function ProductImage({ product, family, priority }: { product: Product; family: Family; priority?: boolean }) {
  const accent = accentStyles[family.accent]
  return (
    <div className={cx('relative aspect-[4/5] overflow-hidden rounded-lg bg-gradient-to-b', accent.tint)}>
      {product.image ? (
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-6"
          priority={priority}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center" role="img" aria-label={`${product.name}: product photo coming soon`}>
          <div className={cx('h-24 w-14 rounded-t-2xl rounded-b-md opacity-80 shadow-inner sm:h-32 sm:w-20', accent.bar)} />
          <span className="text-xs font-medium text-muted">Photo coming soon</span>
        </div>
      )}
    </div>
  )
}

/** Purchase button. Only rendered for products the retail shop sells; others get no link at all. */
export function BuyButton({ product, className }: { product: Product; className?: string }) {
  if (!product.shopSlug) return null
  return (
    <a href={buyLink(product.shopSlug)} target="_blank" rel="noopener" className={buttonStyles('primary', className)}>
      Buy now
      <span className="sr-only">: {product.name} (opens in a new tab)</span>
    </a>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const family = familyOf(product)
  const accent = accentStyles[family.accent]
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-lg">
      <div className={cx('h-1', accent.bar)} />
      <div className="p-4">
        <ProductImage product={product} family={family} />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5">
        <p className={cx('text-xs font-semibold tracking-wide uppercase', accent.text)}>{family.name}</p>
        <h3 className="text-lg leading-snug">
          {/* The whole card is clickable through this link's stretched overlay. */}
          <Link href={productHref(product)} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        {product.format || product.size ? (
          <p className="text-sm text-muted">{[product.format, product.size].filter(Boolean).join(' · ')}</p>
        ) : null}
        {product.shopSlug ? (
          <div className="relative z-10 mt-auto pt-3">
            <BuyButton product={product} className="w-full" />
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <li key={`${p.category}/${p.family}/${p.slug}`} className="flex">
          <div className="w-full">
            <ProductCard product={p} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function FamilyCard({ category, family, count }: { category: Category; family: Family; count: number }) {
  const accent = accentStyles[family.accent]
  return (
    <Link
      href={`/${category.slug}/${family.slug}`}
      className="group flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
    >
      <span className={cx('mb-4 h-1.5 w-10 rounded-full', accent.bar)} aria-hidden="true" />
      <span className="text-lg font-bold text-brand group-hover:underline">{family.name}</span>
      {family.focus ? <span className="mt-1 text-sm text-muted">{family.focus}</span> : null}
      <span className="mt-auto pt-4 text-xs font-medium text-muted">
        {count ? `${count} ${count === 1 ? 'product' : 'products'}` : 'Products coming soon'}
      </span>
    </Link>
  )
}
