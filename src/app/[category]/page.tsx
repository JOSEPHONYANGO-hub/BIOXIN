import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FamilyCard, ProductGrid } from '@/components/catalog/Catalog'
import { Breadcrumbs, Container, cx, Section, SectionHeading } from '@/components/ui'
import { type Category, categories, getCategory, productsIn } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ need?: string; type?: string }>
}

// Only the three known categories exist; anything else is a 404.
export const dynamicParams = false
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }))

export async function generateMetadata({ params }: Props) {
  const category = getCategory((await params).category)
  if (!category) return {}
  return pageMeta({ title: `${category.name} products`, description: category.intro, path: `/${category.slug}` })
}

function FilterChips({ category, kind, items, active }: { category: Category; kind: 'need' | 'type'; items: Category['needs']; active?: string }) {
  return (
    <ul className="flex flex-wrap gap-2">
      <li>
        <Link
          href={`/${category.slug}#products`}
          aria-current={!active ? 'true' : undefined}
          className={cx(
            'inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium',
            !active ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-brand',
          )}
        >
          All
        </Link>
      </li>
      {items.map((f) => (
        <li key={f.slug}>
          <Link
            href={`/${category.slug}?${kind}=${f.slug}#products`}
            aria-current={active === f.slug ? 'true' : undefined}
            className={cx(
              'inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium',
              active === f.slug ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-brand',
            )}
          >
            {f.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = getCategory((await params).category)
  if (!category) notFound()
  const { need, type } = await searchParams
  const activeNeed = category.needs.find((n) => n.slug === need)
  const activeType = category.types.find((t) => t.slug === type)

  const items = productsIn(category.slug).filter(
    (p) => (!activeNeed || p.needs.includes(activeNeed.slug)) && (!activeType || p.type === activeType.slug),
  )
  const heading = activeNeed?.name ?? activeType?.name ?? `All ${category.name.toLowerCase()}`

  return (
    <>
      <header className="relative overflow-hidden bg-brand text-white">
        <Image src={category.image} alt="" fill priority sizes="100vw" className="object-cover object-right opacity-40 md:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/90 to-brand/0" />
        <Container className="relative py-12 sm:py-16">
          <div className="[&_a]:text-white/85 [&_nav]:text-white/85 [&_span]:text-white">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: category.name }]} />
          </div>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-accent-light uppercase">Bioxcin</p>
          <h1 className="max-w-2xl text-3xl text-white sm:text-5xl">{category.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">{category.intro}</p>
        </Container>
      </header>

      <Section aria-labelledby="families-heading">
        <SectionHeading id="families-heading" title="Product families" />
        <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {category.families.map((f) => (
            <li key={f.slug}>
              <FamilyCard category={category} family={f} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" aria-labelledby="products-heading" id="products" className="scroll-mt-28">
        <h2 id="products-heading" className="text-3xl sm:text-4xl">
          {heading}
        </h2>
        <div className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">Needs</p>
            <FilterChips category={category} kind="need" items={category.needs} active={activeNeed?.slug} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">Product types</p>
            <FilterChips category={category} kind="type" items={category.types} active={activeType?.slug} />
          </div>
        </div>
        <p className="mt-6 mb-6 text-sm text-muted" role="status">
          {items.length} {items.length === 1 ? 'product' : 'products'}
        </p>
        {items.length ? <ProductGrid products={items} /> : <p className="text-muted">No products match this filter yet.</p>}
      </Section>
    </>
  )
}
