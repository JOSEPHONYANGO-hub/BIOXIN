/**
 * Catalogue: categories, needs, product types, families and products.
 *
 * Category and family names follow bioxcin.com.tr. The site lists only the Bioxcin products sold on
 * the Eloria shop: the list, prices and stock come live from the shop (see shop.ts), and the
 * curated names, packshots and pack details come from product-info.ts.
 */

export type Accent = 'brand' | 'forte' | 'collagen' | 'keratin' | 'hydra'

export type Family = {
  slug: string
  name: string
  focus?: string
  accent: Accent
  /** One or two sentences shown on the family page. */
  description?: string
}

export type Facet = { slug: string; name: string }

export type Category = {
  slug: 'hair-care' | 'skin-care' | 'supplements'
  name: string
  shortName: string
  intro: string
  image: string
  needs: Facet[]
  types: Facet[]
  families: Family[]
}

export type ProductImage = { src: string; alt: string }

/** Curated details for one shop listing. */
export type ProductInfo = {
  /** Path segment used on this site. */
  slug: string
  name: string
  category: Category['slug']
  family: string
  /** Product type slug from the category's `types`. */
  type: string
  /** Need slugs from the category's `needs`. */
  needs: string[]
  size?: string
  summary: string
  /** Brand packshots. When empty, the shop's own product photo is used. */
  images: ProductImage[]
  benefits: string[]
  ingredients: string[]
  howToUse: string
  clinical?: string[]
}

/** A product as shown on the site: curated details plus live price and stock from the shop. */
export type Product = ProductInfo & {
  /** Product slug on the Eloria shop; the Buy now link goes there. */
  shopSlug: string
  /** Price before discount, in KES. */
  price: number
  /** Price after discount, in KES, when the shop has one. */
  salePrice: number | null
  inStock: boolean
}

export const categories: Category[] = [
  {
    slug: 'hair-care',
    name: 'Hair care',
    shortName: 'Hair',
    intro: 'Shampoos, conditioners, serums, tonics and oils for every hair type and concern, from hair loss to dryness.',
    image: '/images/scenes/hair-care-model.webp',
    needs: [
      { slug: 'hair-loss', name: 'Hair loss' },
      { slug: 'volume', name: 'Volume and fullness' },
      { slug: 'repair', name: 'Damaged hair' },
      { slug: 'nourishment', name: 'Dry hair and nourishment' },
      { slug: 'oily-hair', name: 'Oily hair' },
      { slug: 'dandruff', name: 'Dandruff' },
      { slug: 'brows-lashes', name: 'Brows and lashes' },
    ],
    types: [
      { slug: 'shampoo', name: 'Shampoo' },
      { slug: 'conditioner', name: 'Conditioner' },
      { slug: 'liquid-conditioner', name: 'Liquid conditioner' },
      { slug: 'serum', name: 'Serum' },
      { slug: 'tonic', name: 'Tonic' },
      { slug: 'hair-oil', name: 'Hair oil' },
      { slug: 'mask', name: 'Hair mask' },
    ],
    families: [
      {
        slug: 'forte',
        name: 'Forte',
        focus: 'Intensive hair loss',
        accent: 'forte',
        description: 'Herbal care for intensive hair loss, with the patented BioComplex B11 formula and liposome technology.',
      },
      {
        slug: 'collagen-biotin',
        name: 'Collagen & Biotin',
        focus: 'Volume and fullness',
        accent: 'collagen',
        description: 'Volumising care with collagen and biotin and Extra Volume technology, for fine hair that is prone to falling out.',
      },
      {
        slug: 'keratin-argan',
        name: 'Keratin & Argan',
        focus: 'Damage repair',
        accent: 'keratin',
        description: 'Repairing care with keratin and argan oil and Extra Repair technology, for damaged hair that is prone to falling out.',
      },
      {
        slug: 'biotin',
        name: 'Biotin',
        focus: 'Hair loss',
        accent: 'brand',
        description: 'Daily care shampoo with biotin for all hair types.',
      },
      {
        slug: 'caffeine-arginine',
        name: 'Caffeine & Arginine',
        focus: 'Hair loss',
        accent: 'brand',
        description: 'Anti hair loss shampoo with caffeine and arginine.',
      },
      {
        slug: 'black-garlic',
        name: 'Black Garlic',
        focus: 'Hair loss and thinning',
        accent: 'brand',
        description: 'Sulphate-free herbal shampoo with black garlic for hair loss.',
      },
      {
        slug: 'classic',
        name: 'Classic',
        focus: 'Hair loss',
        accent: 'brand',
        description: 'The original Bioxcin herbal shampoo for hair loss.',
      },
      {
        slug: 'quantum',
        name: 'Quantum',
        focus: 'Volume',
        accent: 'brand',
        description: 'Shampoo with Bio-Activ peptides.',
      },
      { slug: 'aqua-thermal', name: 'Aqua Thermal', focus: 'Dandruff', accent: 'brand' },
      {
        slug: 'nourishing-oils',
        name: 'Nourishing Oils',
        focus: 'Nourishment',
        accent: 'keratin',
        description: 'Nourishing care with a blend of nine oils and vitamin B5.',
      },
      {
        slug: 'brow-lash-serum',
        name: 'Brow & Lash Serum',
        focus: 'Brows and lashes',
        accent: 'brand',
        description: 'Serum pen for eyelashes and eyebrows.',
      },
    ],
  },
  {
    slug: 'skin-care',
    name: 'Skin care',
    shortName: 'Skin',
    intro: 'Cleansers, serums, moisturisers and sun protection for acne-prone, dry, sensitive and mature skin.',
    image: '/images/scenes/skin-glow.webp',
    needs: [
      { slug: 'acne', name: 'Acne-prone skin' },
      { slug: 'anti-ageing', name: 'Wrinkles and firmness' },
      { slug: 'hydration', name: 'Hydration' },
      { slug: 'sensitive', name: 'Dry, sensitive and atopic skin' },
      { slug: 'sun-protection', name: 'Sun protection' },
      { slug: 'dark-spots', name: 'Dark spots and radiance' },
    ],
    types: [
      { slug: 'cleanser', name: 'Cleanser' },
      { slug: 'toner', name: 'Toner and micellar water' },
      { slug: 'serum', name: 'Serum' },
      { slug: 'face-cream', name: 'Face cream' },
      { slug: 'eye-cream', name: 'Eye cream' },
      { slug: 'sun-cream', name: 'Sun protection' },
      { slug: 'body', name: 'Body care' },
    ],
    families: [
      {
        slug: 'hydra',
        name: 'Hydra',
        focus: 'Hydration',
        accent: 'hydra',
        description: 'Moisturising care for the face, for normal to dry and for oily skin.',
      },
      {
        slug: 'skin-expert',
        name: 'Skin Expert',
        focus: 'Targeted serums',
        accent: 'hydra',
        description: 'Concentrated face serums with a single hero active.',
      },
      {
        slug: 'acnium',
        name: 'Acnium',
        focus: 'Acne-prone skin',
        accent: 'brand',
        description: 'Care for oily, combination and acne-prone skin with the Acnium Herbal Complex.',
      },
      {
        slug: 'age-reverse',
        name: 'Age Reverse',
        focus: 'Anti-wrinkle',
        accent: 'brand',
        description: 'Anti-wrinkle care with filling and firming actives, for all skin types.',
      },
      {
        slug: 'atopicare',
        name: 'Atopicare',
        focus: 'Dry and atopic-prone skin',
        accent: 'brand',
        description: 'Care for very dry and atopic-prone skin with a patented skin barrier formula.',
      },
      {
        slug: 'sun-care',
        name: 'Sun Care',
        focus: 'Sun protection',
        accent: 'brand',
        description: 'Very high SPF 50+ protection for every skin type, including babies and children.',
      },
      {
        slug: 'gold-on-skin',
        name: 'Gold On Skin',
        focus: 'Body care',
        accent: 'keratin',
        description: 'Dry oil for face, body and hair.',
      },
      { slug: 'body-care', name: 'Body Care', focus: 'Everyday body care', accent: 'brand' },
    ],
  },
  {
    slug: 'supplements',
    name: 'Food supplements',
    shortName: 'Supplements',
    intro: 'Beauty supplements in tablet and powder form to support hair, skin and nails.',
    image: '/images/scenes/supplement-model.webp',
    needs: [
      { slug: 'hair', name: 'Hair support' },
      { slug: 'skin', name: 'Skin support' },
      { slug: 'active', name: 'Active lifestyle' },
    ],
    types: [
      { slug: 'tablet', name: 'Tablets' },
      { slug: 'powder', name: 'Powder' },
    ],
    families: [
      {
        slug: 'collagen-powder',
        name: 'Collagen Powder',
        focus: 'Beauty from within',
        accent: 'collagen',
        description: 'Collagen powder supplements to mix into a drink.',
      },
      { slug: 'collagen', name: 'Collagen', accent: 'brand' },
      { slug: 'beauty-booster', name: 'Beauty Booster', accent: 'collagen' },
      { slug: 'hair-tablet', name: 'Hair Tablet', focus: 'Hair support', accent: 'brand' },
      { slug: 'skin-tablet', name: 'Skin Tablet', focus: 'Skin support', accent: 'brand' },
      {
        slug: 'keratin',
        name: 'Keratin',
        accent: 'forte',
        description: 'Keratin Complex tablets with amino acids, biotin and zinc.',
      },
      { slug: 'biotin', name: 'Biotin', accent: 'brand' },
    ],
  },
]

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)

export const getFamily = (category: Category, slug: string) => category.families.find((f) => f.slug === slug)

export const productHref = (p: Pick<Product, 'category' | 'family' | 'slug'>) => `/${p.category}/${p.family}/${p.slug}`

export const familyOf = (p: Pick<Product, 'category' | 'family'>) => getFamily(getCategory(p.category)!, p.family)!

export const productsIn = (products: Product[], categorySlug: string, familySlug?: string) =>
  products.filter((p) => p.category === categorySlug && (!familySlug || p.family === familySlug))

/** Families that have at least one product in the shop. Families without products are not shown. */
export const familiesWithProducts = (products: Product[], category: Category) =>
  category.families.filter((f) => products.some((p) => p.category === category.slug && p.family === f.slug))

/** Price actually charged: the sale price when there is a real discount, otherwise the regular price. */
export const displayPrice = (p: Pick<Product, 'price' | 'salePrice'>) =>
  p.salePrice !== null && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price

/** Same formatting as the Eloria shop: "Ksh 1,975". */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(value)
