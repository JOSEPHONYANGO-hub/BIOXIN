import { notFound } from 'next/navigation'
import { FamilyCard, ProductGrid } from '@/components/catalog/Catalog'
import { PageHeader, Section, SectionHeading } from '@/components/ui'
import { categories, getCategory, productsIn } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'

type Params = { params: Promise<{ category: string }> }

// Only the three known categories exist; anything else is a 404.
export const dynamicParams = false
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }))

export async function generateMetadata({ params }: Params) {
  const category = getCategory((await params).category)
  if (!category) return {}
  return pageMeta({ title: `${category.name} products`, description: category.intro, path: `/${category.slug}` })
}

export default async function CategoryPage({ params }: Params) {
  const category = getCategory((await params).category)
  if (!category) notFound()
  const items = productsIn(category.slug)

  return (
    <>
      <PageHeader
        eyebrow="Bioxcin"
        title={category.name}
        intro={category.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: category.name }]}
      />
      <Section aria-labelledby="families-heading">
        <SectionHeading id="families-heading" title="Product families" />
        <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {category.families.map((f) => (
            <li key={f.slug}>
              <FamilyCard category={category} family={f} count={productsIn(category.slug, f.slug).length} />
            </li>
          ))}
        </ul>
      </Section>
      {items.length ? (
        <Section tone="surface" aria-labelledby="products-heading">
          <SectionHeading id="products-heading" title={`All ${category.name.toLowerCase()} products`} />
          <ProductGrid products={items} />
        </Section>
      ) : null}
    </>
  )
}
