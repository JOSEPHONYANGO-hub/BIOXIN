import { notFound } from 'next/navigation'
import { accentStyles, ProductGrid } from '@/components/catalog/Catalog'
import { ArrowLink, cx, PageHeader, Section } from '@/components/ui'
import { categories, familiesWithProducts, getCategory, getFamily, productsIn } from '@/lib/catalog'
import { getProducts } from '@/lib/shop'
import { pageMeta } from '@/lib/seo'

type Params = { params: Promise<{ category: string; family: string }> }

// Families come and go with the shop's stock list, so unknown or empty families are a 404.
export const dynamicParams = true
export const generateStaticParams = async () => {
  const products = await getProducts()
  return categories.flatMap((c) => familiesWithProducts(products, c).map((f) => ({ category: c.slug, family: f.slug })))
}

async function load(params: Params['params']) {
  const { category: c, family: f } = await params
  const category = getCategory(c)
  const family = category && getFamily(category, f)
  if (!category || !family) return null
  const items = productsIn(await getProducts(), category.slug, family.slug)
  return items.length ? { category, family, items } : null
}

export async function generateMetadata({ params }: Params) {
  const found = await load(params)
  if (!found) return {}
  const { category, family } = found
  return pageMeta({
    title: `${family.name} ${category.name.toLowerCase()}`,
    description: `Bioxcin ${family.name}${family.focus ? `: ${family.focus.toLowerCase()}` : ''}. Explore the ${family.name} range in Kenya.`,
    path: `/${category.slug}/${family.slug}`,
  })
}

export default async function FamilyPage({ params }: Params) {
  const found = await load(params)
  if (!found) notFound()
  const { category, family, items } = found
  const accent = accentStyles[family.accent]

  return (
    <>
      <div className={cx('h-1.5', accent.bar)} aria-hidden="true" />
      <PageHeader
        eyebrow={family.focus ?? category.name}
        title={`Bioxcin ${family.name}`}
        intro={family.description}
        crumbs={[{ label: 'Home', href: '/' }, { label: category.name, href: `/${category.slug}` }, { label: family.name }]}
      />
      <Section aria-label={`${family.name} products`}>
        <ProductGrid products={items} />
        <div className="mt-10">
          <ArrowLink href={`/${category.slug}`}>All {category.name.toLowerCase()}</ArrowLink>
        </div>
      </Section>
    </>
  )
}
