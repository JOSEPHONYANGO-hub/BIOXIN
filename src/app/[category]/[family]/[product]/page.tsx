import { notFound } from 'next/navigation'
import { accentStyles, BuyButton, FamilyBadge, ProductGrid, WhatsAppButton } from '@/components/catalog/Catalog'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { ProductTabs, type Tab } from '@/components/catalog/ProductTabs'
import { JsonLd } from '@/components/JsonLd'
import { Icon } from '@/components/Icon'
import { Breadcrumbs, Container, cx, Section, SectionHeading } from '@/components/ui'
import { familyOf, getCategory, getProduct, productHref, products, productsIn } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'
import { siteUrl } from '@/lib/site'

type Params = { params: Promise<{ category: string; family: string; product: string }> }

export const dynamicParams = false
export const generateStaticParams = () => products.map((p) => ({ category: p.category, family: p.family, product: p.slug }))

async function load(params: Params['params']) {
  const { category, family, product } = await params
  return getProduct(category, family, product)
}

export async function generateMetadata({ params }: Params) {
  const product = await load(params)
  if (!product) return {}
  const meta = pageMeta({
    title: `Bioxcin ${product.name}`,
    description: `Bioxcin ${product.name}${product.size ? `, ${product.size}` : ''}. ${product.summary}`,
    path: productHref(product),
  })
  const image = product.images[0]
  return image ? { ...meta, openGraph: { ...meta.openGraph, images: [{ url: image.src, alt: image.alt }] } } : meta
}

export default async function ProductPage({ params }: Params) {
  const product = await load(params)
  if (!product) notFound()
  const category = getCategory(product.category)!
  const family = familyOf(product)
  const accent = accentStyles[family.accent]
  const related = productsIn(product.category, product.family).filter((p) => p.slug !== product.slug)
  const typeName = category.types.find((t) => t.slug === product.type)?.name

  const tabs: Tab[] = [
    {
      key: 'ingredients',
      label: 'Active ingredients',
      content: (
        <ul className="flex flex-wrap gap-2">
          {product.ingredients.map((i) => (
            <li key={i} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink">
              {i}
            </li>
          ))}
        </ul>
      ),
    },
    { key: 'use', label: 'How to use', content: <p className="text-ink">{product.howToUse}</p> },
    {
      key: 'clinical',
      label: 'Clinical studies',
      content: product.clinical?.length ? (
        <ul className="space-y-2">
          {product.clinical.map((c) => (
            <li key={c} className="flex gap-2 text-ink">
              <Icon name="check" className={cx('mt-0.5 size-5 shrink-0', accent.text)} />
              {c}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Dermatologically tested. Study results for this product are printed on its packaging.</p>
      ),
    },
  ]

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Bioxcin ${product.name}`,
    brand: { '@type': 'Brand', name: 'Bioxcin' },
    description: product.summary,
    image: product.images.map((i) => `${siteUrl}${i.src}`),
    url: `${siteUrl}${productHref(product)}`,
  }

  return (
    <>
      <div className={cx('h-1.5', accent.bar)} aria-hidden="true" />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: category.name, href: `/${category.slug}` },
            { label: family.name, href: `/${category.slug}/${family.slug}` },
            { label: product.name },
          ]}
        />
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="mx-auto w-full max-w-lg lg:max-w-none">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <FamilyBadge family={family} />
              {family.focus ? <span className={cx('text-sm font-medium', accent.text)}>{family.focus}</span> : null}
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl">{product.name}</h1>
            {typeName || product.size ? <p className="mt-2 text-muted">{[typeName, product.size].filter(Boolean).join(' · ')}</p> : null}
            <p className="mt-5 text-lg">{product.summary}</p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-ink">
                  <Icon name="check" className={cx('mt-0.5 size-5 shrink-0', accent.text)} />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BuyButton product={product} className="sm:min-w-48" />
              <WhatsAppButton product={product} className="sm:min-w-48" />
            </div>

            <div className="mt-10">
              <ProductTabs tabs={tabs} />
            </div>
          </div>
        </div>
      </Container>

      {related.length ? (
        <Section tone="surface" aria-labelledby="related-heading">
          <SectionHeading id="related-heading" title={`More from ${family.name}`} />
          <ProductGrid products={related} />
        </Section>
      ) : null}
      <JsonLd data={productLd} />
    </>
  )
}
