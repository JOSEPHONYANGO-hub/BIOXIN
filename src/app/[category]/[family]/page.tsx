import { notFound } from 'next/navigation'
import { accentStyles, ProductGrid } from '@/components/catalog/Catalog'
import { ArrowLink, cx, PageHeader, PendingNotice, Section } from '@/components/ui'
import { categories, getCategory, getFamily, productsIn } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'

type Params = { params: Promise<{ category: string; family: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  categories.flatMap((c) => c.families.map((f) => ({ category: c.slug, family: f.slug })))

async function load(params: Params['params']) {
  const { category: c, family: f } = await params
  const category = getCategory(c)
  const family = category && getFamily(category, f)
  return category && family ? { category, family } : null
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
  const { category, family } = found
  const items = productsIn(category.slug, family.slug)
  const accent = accentStyles[family.accent]

  return (
    <>
      <div className={cx('h-1.5', accent.bar)} aria-hidden="true" />
      <PageHeader
        eyebrow={family.focus ?? category.name}
        title={`Bioxcin ${family.name}`}
        crumbs={[{ label: 'Home', href: '/' }, { label: category.name, href: `/${category.slug}` }, { label: family.name }]}
      />
      <Section aria-label={`${family.name} products`}>
        <div className="mb-8">
          <PendingNotice>The approved description of the {family.name} range will be added in the next phase.</PendingNotice>
        </div>
        {items.length ? (
          <ProductGrid products={items} />
        ) : (
          <p className="text-muted">Products in this range will be listed soon.</p>
        )}
        <div className="mt-10">
          <ArrowLink href={`/${category.slug}`}>All {category.name.toLowerCase()}</ArrowLink>
        </div>
      </Section>
    </>
  )
}
