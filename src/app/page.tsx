import Link from 'next/link'
import { accentStyles, ProductGrid } from '@/components/catalog/Catalog'
import { Icon } from '@/components/Icon'
import { ArrowLink, ButtonLink, Container, cx, Section, SectionHeading } from '@/components/ui'
import { categories, products } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'
import { partnerNav, seoDefaults } from '@/lib/site'

export const metadata = pageMeta({ description: seoDefaults.description, path: '/' })

// Signature families named in the brand identity document, each with its own accent colour.
const signature = [
  { category: 'hair-care', family: 'forte' },
  { category: 'hair-care', family: 'collagen-biotin' },
  { category: 'hair-care', family: 'keratin-argan' },
  { category: 'skin-care', family: 'hydra' },
] as const

export default function HomePage() {
  const featured = signature.map(({ category, family }) => {
    const c = categories.find((x) => x.slug === category)!
    return { category: c, family: c.families.find((f) => f.slug === family)! }
  })

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 size-[28rem] rounded-full bg-accent/20 blur-3xl sm:size-[40rem]"
        />
        <Container className="relative grid gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-accent-light uppercase">Bioxcin in Kenya</p>
            <h1 className="text-4xl leading-[1.08] text-white sm:text-6xl">Science-led care for hair and skin</h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Discover the Bioxcin range of hair care, skin care and beauty supplements, and find the right product for your needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/hair-care" variant="onDark">
                Explore hair care
              </ButtonLink>
              <ButtonLink href="/skin-care" variant="outlineOnDark">
                Explore skin care
              </ButtonLink>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-3 lg:col-span-5" aria-label="Product categories">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="flex aspect-[3/4] flex-col justify-end rounded-xl border border-white/15 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <span className="text-sm font-semibold sm:text-base">{c.name}</span>
                  <span className="mt-1 text-xs text-white/75">{c.families.length} families</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Categories */}
      <Section aria-labelledby="categories-heading">
        <SectionHeading id="categories-heading" eyebrow="Shop by category" title="Care for every need" />
        <ul className="grid gap-6 md:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug} className="flex flex-col rounded-xl border border-line bg-surface p-6">
              <h3 className="text-xl">{c.name}</h3>
              <p className="mt-2 text-muted">{c.intro}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {c.families.slice(0, 5).map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/${c.slug}/${f.slug}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3 text-sm text-ink hover:border-brand"
                    >
                      {f.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <ArrowLink href={`/${c.slug}`}>All {c.name.toLowerCase()}</ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Signature families */}
      <Section tone="surface" aria-labelledby="families-heading">
        <SectionHeading id="families-heading" eyebrow="Product families" title="Signature ranges" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ category, family }) => {
            const a = accentStyles[family.accent]
            return (
              <li key={family.slug}>
                <Link
                  href={`/${category.slug}/${family.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-line transition-shadow hover:shadow-md"
                >
                  <span className={cx('h-2', a.bar)} aria-hidden="true" />
                  <span className="flex flex-1 flex-col p-6">
                    <span className={cx('text-xs font-semibold tracking-wide uppercase', a.text)}>{category.shortName}</span>
                    <span className="mt-2 text-xl font-bold text-brand group-hover:underline">{family.name}</span>
                    <span className="mt-1 text-sm text-muted">{family.focus}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* Products */}
      <Section aria-labelledby="products-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="products-heading" eyebrow="Products" title="Featured products" />
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </Section>

      {/* Science */}
      <Section tone="surface" aria-labelledby="science-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            id="science-heading"
            eyebrow="Science & ingredients"
            title="Formulated with care"
            intro="Learn about the key ingredients and technologies behind each Bioxcin range, and how to choose the right routine."
          />
          <div>
            <ButtonLink href="/science" variant="secondary">
              Explore the science
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Business band: visually distinct from consumer product discovery */}
      <section aria-labelledby="business-heading" className="bg-brand-dark py-14 text-white sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-accent-light uppercase">For business</p>
              <h2 id="business-heading" className="text-3xl text-white sm:text-4xl">
                Partner with Bioxcin in Kenya
              </h2>
              <p className="mt-4 text-lg text-white/85">
                Pharmacies, retailers and distributors can enquire about stocking and supplying the Bioxcin range.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {partnerNav.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="flex h-full flex-col rounded-xl border border-white/20 p-6 transition-colors hover:border-accent hover:bg-white/5"
                  >
                    <span className="text-lg font-bold">{p.label}</span>
                    <span className="mt-2 text-sm text-white/80">{p.description}</span>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-light">
                      Send an enquiry <Icon name="arrowRight" className="size-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  )
}
