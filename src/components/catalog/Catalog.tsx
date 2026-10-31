import Image from 'next/image'
import Link from 'next/link'
import type { Accent, Category, Family, Product } from '@/lib/catalog'
import { familyOf, productHref, productsIn } from '@/lib/catalog'
import { buyLink, productCta, whatsappEnquiryLink } from '@/lib/site'
import { Icon } from '../Icon'
import { buttonStyles, cx } from '../ui'

/** Family accent colours from the brand identity document, with AA-safe text shades. */
export const accentStyles: Record<Accent, { bar: string; text: string; tint: string; badge: string; border: string }> = {
  brand: { bar: 'bg-brand', text: 'text-brand', tint: 'bg-surface', badge: 'bg-brand text-white', border: 'hover:border-brand' },
  forte: { bar: 'bg-forte', text: 'text-forte', tint: 'bg-forte/5', badge: 'bg-forte text-white', border: 'hover:border-forte' },
  collagen: {
    bar: 'bg-collagen',
    text: 'text-collagen',
    tint: 'bg-collagen/5',
    badge: 'bg-collagen text-white',
    border: 'hover:border-collagen',
  },
  keratin: {
    bar: 'bg-keratin',
    text: 'text-keratin-ink',
    tint: 'bg-keratin/10',
    badge: 'bg-keratin text-ink',
    border: 'hover:border-keratin',
  },
  hydra: { bar: 'bg-hydra', text: 'text-hydra-ink', tint: 'bg-hydra/5', badge: 'bg-hydra-ink text-white', border: 'hover:border-hydra' },
}

/** Family badge in the family's accent colour. */
export function FamilyBadge({ family, className }: { family: Family; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wide uppercase',
        accentStyles[family.accent].badge,
        className,
      )}
    >
      {family.name}
    </span>
  )
}

/** Square packshot on white. Products without a photo yet show the Bioxcin logo instead. */
export function ProductImage({
  product,
  priority,
  sizes = '(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 420px) 45vw, 90vw',
}: {
  product: Product
  priority?: boolean
  sizes?: string
}) {
  const main = product.images[0]
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
      {main ? (
        <Image src={main.src} alt={main.alt} fill sizes={sizes} className="object-contain" priority={priority} />
      ) : (
        <div className="flex h-full items-center justify-center bg-surface p-10">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo */}
          <img src="/images/logo.svg" alt={`Bioxcin ${product.name}`} className="w-3/4 max-w-56 opacity-80" />
        </div>
      )}
    </div>
  )
}

/** "Buy now" link to the retail shop. Only for products the shop sells; others get no link at all. */
export function BuyButton({ product, className }: { product: Product; className?: string }) {
  if (!product.shopSlug || productCta === 'whatsapp') return null
  return (
    <a href={buyLink(product.shopSlug)} target="_blank" rel="noopener" className={buttonStyles('primary', className)}>
      Buy now
      <span className="sr-only">: {product.name} (opens in a new tab)</span>
    </a>
  )
}

/** Pre-filled WhatsApp enquiry about this product. */
export function WhatsAppButton({ product, className }: { product: Product; className?: string }) {
  if (productCta === 'buy') return null
  return (
    <a
      href={whatsappEnquiryLink(product.name)}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1f7a4d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#17603c]',
        className,
      )}
    >
      <Icon name="whatsapp" className="size-5" />
      Enquire on WhatsApp
      <span className="sr-only">about {product.name} (opens in a new tab)</span>
    </a>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const family = familyOf(product)
  const accent = accentStyles[family.accent]
  return (
    <article
      className={cx(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg',
        accent.border,
      )}
    >
      <div className={cx('h-1', accent.bar)} />
      <div className="p-4 pb-2">
        <ProductImage product={product} />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5">
        <div>
          <FamilyBadge family={family} />
        </div>
        <h3 className="text-base leading-snug sm:text-lg">
          {/* The whole card is clickable through this link's stretched overlay. */}
          <Link href={productHref(product)} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        {product.size ? <p className="text-sm text-muted">{product.size}</p> : null}
        {product.shopSlug && productCta !== 'whatsapp' ? (
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
    <ul className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <li key={`${p.category}/${p.family}/${p.slug}`}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  )
}

export function FamilyCard({ category, family }: { category: Category; family: Family }) {
  const accent = accentStyles[family.accent]
  const count = productsIn(category.slug, family.slug).length
  return (
    <Link
      href={`/${category.slug}/${family.slug}`}
      className={cx('group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-md', accent.border)}
    >
      <span className={cx('h-1', accent.bar)} aria-hidden="true" />
      {family.image ? (
        <span className={cx('relative block aspect-[4/3]', accent.tint)}>
          <Image src={family.image} alt="" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-contain p-4" />
        </span>
      ) : null}
      <span className="flex flex-1 flex-col p-5">
        <span className="text-lg font-bold text-brand group-hover:underline">{family.name}</span>
        {family.focus ? <span className={cx('mt-1 text-sm font-medium', accent.text)}>{family.focus}</span> : null}
        <span className="mt-auto pt-3 text-xs font-medium text-muted">
          {count ? `${count} ${count === 1 ? 'product' : 'products'}` : 'Coming soon'}
        </span>
      </span>
    </Link>
  )
}
