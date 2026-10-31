import Image from 'next/image'
import Link from 'next/link'
import { ProductGrid } from '@/components/catalog/Catalog'
import { HeroCarousel, type Slide } from '@/components/home/HeroCarousel'
import { RoutineBuilder, type Routine } from '@/components/home/RoutineBuilder'
import { Icon } from '@/components/Icon'
import { Container, cx, Section, SectionHeading } from '@/components/ui'
import { categories, findProduct, productHref, products } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'
import { partnerNav, seoDefaults } from '@/lib/site'

export const metadata = pageMeta({ description: seoDefaults.description, path: '/' })

const slides: Slide[] = [
  {
    image: '/images/scenes/hero-forte.webp',
    position: '70% center',
    eyebrow: 'Bioxcin Forte',
    title: 'Strong defence against hair loss',
    text: 'Herbal care for intensive hair loss, with the patented BioComplex B11 formula and liposome technology.',
    href: '/hair-care/forte',
    cta: 'Explore range',
  },
  {
    image: '/images/scenes/hair-swirl.webp',
    position: '75% center',
    eyebrow: 'Hair care',
    title: 'Volume, repair and care for every hair type',
    text: 'Collagen & Biotin for fullness, Keratin & Argan for damaged hair, and Nourishing Oils for dry hair.',
    href: '/hair-care',
    cta: 'Explore range',
  },
  {
    image: '/images/scenes/skin-mature.webp',
    position: '80% 30%',
    eyebrow: 'Age Reverse',
    title: 'Anti-wrinkle care for all skin types',
    text: 'Filling and firming creams, serum and night eye cream.',
    href: '/skin-care/age-reverse',
    cta: 'Explore range',
  },
  {
    image: '/images/scenes/hero-lab.webp',
    position: '70% center',
    eyebrow: 'Laboratories of dermocosmetic',
    title: 'Science-led care for hair and skin',
    text: 'Dermocosmetic formulas developed in the laboratory and tested on skin.',
    href: '/hair-care',
    cta: 'Explore range',
  },
]

type Showcase = { name: string; focus: string; href: string; image: string; panel: string; cover?: boolean }

const showcase: Showcase[] = [
  { name: 'Forte', focus: 'Intensive hair loss', href: '/hair-care/forte', image: '/images/products/forte-shampoo.webp', panel: 'from-forte to-[#5c0000]' },
  {
    name: 'Keratin & Argan',
    focus: 'Damage repair',
    href: '/hair-care/keratin-argan',
    image: '/images/products/keratin-argan-oil.webp',
    panel: 'from-keratin-ink to-[#4f3d08]',
  },
  {
    name: 'Collagen & Biotin',
    focus: 'Volume and fullness',
    href: '/hair-care/collagen-biotin',
    image: '/images/products/collagen-biotin-shampoo.webp',
    panel: 'from-collagen to-[#5e2a75]',
  },
  { name: 'Hydra', focus: 'Skin Expert hydration', href: '/skin-care/hydra', image: '/images/products/hydra-cream-normal-dry.webp', cover: true, panel: 'from-hydra-ink to-[#00477a]' },
  {
    name: 'Beauty Boosters',
    focus: 'Food supplements',
    href: '/supplements',
    image: '/images/products/keratin-complex.webp',
    panel: 'from-brand to-brand-dark',
  },
]

const step = (slug: string, stepName: string, verb: string) => {
  const p = findProduct(slug)!
  return { step: stepName, verb, name: p.name, href: productHref(p), image: p.images[0].src, alt: p.images[0].alt }
}

const routines: Routine[] = [
  {
    key: 'hair-loss',
    label: 'Hair loss',
    accent: 'text-forte',
    steps: [
      step('forte-shampoo', 'Cleanse', 'Shampoo'),
      step('forte-serum', 'Treat', 'Serum'),
      step('keratin-complex-tablets', 'Nourish', 'Supplement'),
    ],
  },
  {
    key: 'volume',
    label: 'Fine, flat hair',
    accent: 'text-collagen',
    steps: [
      step('collagen-biotin-shampoo', 'Cleanse', 'Shampoo'),
      step('collagen-biotin-serum', 'Treat', 'Serum'),
      step('keratin-complex-tablets', 'Nourish', 'Supplement'),
    ],
  },
  {
    key: 'repair',
    label: 'Damaged hair',
    accent: 'text-keratin-ink',
    steps: [
      step('keratin-argan-shampoo', 'Cleanse', 'Shampoo'),
      step('keratin-argan-hair-oil', 'Treat', 'Hair oil'),
      step('keratin-complex-tablets', 'Nourish', 'Supplement'),
    ],
  },
]

const stats = [
  { value: '98%', label: 'volume', note: 'Collagen & Biotin, Extra Volume technology' },
  { value: '94%', label: 'repair', note: 'Keratin & Argan, Extra Repair technology' },
  { value: '0', label: 'parabens', note: 'Dermatologically tested, hypoallergenic hair care' },
]

export default function HomePage() {
  const featured = products.filter((p) => p.shopSlug && p.images.length).slice(0, 8)

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Categories */}
      <Section aria-labelledby="categories-heading">
        <SectionHeading id="categories-heading" eyebrow="Shop by category" title="Care for every need" />
        <ul className="grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`} className="group relative block overflow-hidden rounded-2xl">
                <span className="relative block aspect-[4/3] md:aspect-[4/5]">
                  <Image src={c.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="block text-2xl font-bold">{c.name}</span>
                  <span className="mt-1 block text-sm text-white/90">{c.intro}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-light">
                    Explore range <Icon name="arrowRight" className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Product family showcase */}
      <Section tone="surface" aria-labelledby="families-heading">
        <SectionHeading id="families-heading" eyebrow="Product families" title="Find your Bioxcin range" />
        <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-5">
          {showcase.map((f) => (
            <li key={f.name}>
              <Link
                href={f.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line transition-shadow hover:shadow-lg"
              >
                <span className="relative block aspect-square bg-white">
                  <Image
                    src={f.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 18vw, 45vw"
                    className={cx('transition-transform duration-500 group-hover:scale-105', f.cover ? 'object-cover' : 'object-contain p-5')}
                  />
                </span>
                <span className={cx('flex flex-1 flex-col bg-gradient-to-br p-5 text-white', f.panel)}>
                  <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">{f.focus}</span>
                  <span className="mt-1 flex items-center justify-between gap-2 text-lg font-bold">
                    {f.name}
                    <Icon name="arrowRight" className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3-step routine */}
      <Section aria-labelledby="routine-heading">
        <SectionHeading
          id="routine-heading"
          eyebrow="Build your routine"
          title="Three steps to stronger-looking hair"
          intro="Cleanse, treat and nourish. Choose your concern to see the Bioxcin products for each step."
        />
        <RoutineBuilder routines={routines} />
      </Section>

      {/* Science & trust */}
      <section aria-labelledby="science-heading" className="bg-brand py-14 text-white sm:py-20">
        <Container>
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-accent-light uppercase">Science & trust</p>
            <h2 id="science-heading" className="text-3xl text-white sm:text-4xl">
              Formulated in the laboratory
            </h2>
            <p className="mt-4 text-lg text-white/85">The technologies behind Bioxcin hair care, and the results printed on the pack.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                image: '/images/scenes/biocomplex-b11.webp',
                title: 'BioComplex B11®',
                text: 'The patented herbal formula at the heart of Bioxcin hair loss care, including Forte, Classic, Black Garlic and Quantum.',
              },
              {
                image: '/images/scenes/liposome.webp',
                title: 'Liposome delivery system',
                text: 'Liposome technology carries active ingredients in tiny lipid spheres, used across the Forte range for a fast effect.',
              },
            ].map((t) => (
              <article key={t.title} className="flex gap-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/15 sm:p-6">
                <span className="relative block size-24 shrink-0 overflow-hidden rounded-xl sm:size-32">
                  <Image src={t.image} alt="" fill sizes="128px" className="object-cover" />
                </span>
                <div>
                  <h3 className="text-xl text-white">{t.title}</h3>
                  <p className="mt-2 text-white/85">{t.text}</p>
                </div>
              </article>
            ))}
          </div>
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 p-6">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-5xl font-extrabold text-accent-light">{s.value}</span>
                  <span className="mt-1 block text-lg font-semibold capitalize">{s.label}</span>
                  <span className="mt-2 block text-sm text-white/75">{s.note}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-white/70">Figures as printed on the product packaging.</p>
        </Container>
      </section>

      {/* Products */}
      <Section aria-labelledby="products-heading">
        <SectionHeading id="products-heading" eyebrow="Products" title="Featured products" />
        <ProductGrid products={featured} />
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
