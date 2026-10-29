import { notFound } from 'next/navigation'
import { accentStyles, BuyButton, ProductGrid, ProductImage } from '@/components/catalog/Catalog'
import { Breadcrumbs, Container, cx, PendingNotice, Section, SectionHeading } from '@/components/ui'
import { familyOf, getCategory, getProduct, products, productsIn } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'

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
    description: product.summary ?? `Bioxcin ${product.name}${product.size ? `, ${product.size}` : ''}.`,
    path: `/${product.category}/${product.family}/${product.slug}`,
  })
  // Development samples stay out of search results until their approved content is in.
  return product.status === 'sample' ? { ...meta, robots: { index: false, follow: true } } : meta
}

/** Section headings every product page will carry once approved content is supplied (Phase 3). */
const detailSections = ['Description', 'Key ingredients', 'Benefits', 'How to use']

export default async function ProductPage({ params }: Params) {
  const product = await load(params)
  if (!product) notFound()
  const category = getCategory(product.category)!
  const family = familyOf(product)
  const accent = accentStyles[family.accent]
  const related = productsIn(product.category, product.family).filter((p) => p.slug !== product.slug)

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
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <ProductImage product={product} family={family} priority />
          </div>
          <div>
            <p className={cx('text-sm font-semibold tracking-wide uppercase', accent.text)}>
              {family.name}
              {family.focus ? <span className="font-normal text-muted normal-case"> · {family.focus}</span> : null}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl">{product.name}</h1>
            {product.format || product.size ? (
              <p className="mt-3 text-muted">{[product.format, product.size].filter(Boolean).join(' · ')}</p>
            ) : null}
            {product.summary ? <p className="mt-5 text-lg">{product.summary}</p> : null}

            {product.shopSlug ? (
              <div className="mt-8">
                <BuyButton product={product} className="w-full sm:w-auto sm:min-w-56" />
              </div>
            ) : null}

            {product.status === 'sample' ? (
              <div className="mt-8">
                <PendingNotice>This is a development sample. The approved description, ingredients and photos will be added in the next phase.</PendingNotice>
              </div>
            ) : null}

            <div className="mt-8 divide-y divide-line border-y border-line">
              {detailSections.map((title, i) => (
                <details key={title} className="group" open={i === 0}>
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 font-semibold text-brand [&::-webkit-details-marker]:hidden">
                    <h2 className="text-base">{title}</h2>
                    <span aria-hidden="true" className="text-xl leading-none group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pb-4 text-sm text-muted">To be added from approved brand content.</p>
                </details>
              ))}
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
    </>
  )
}
