/**
 * Catalogue structure: categories, product families and products.
 *
 * Categories and family names follow bioxcin.com.tr (checked 25 Oct 2026). The one-line focus for
 * each family comes from that site's navigation and the brand identity document; full approved
 * copy, ingredients and images arrive in Phase 3. Products marked `status: 'sample'` are
 * development samples that show the templates working, and say so on the page.
 */

export type Accent = 'brand' | 'forte' | 'collagen' | 'keratin' | 'hydra'

export type Family = {
  slug: string
  name: string
  focus?: string
  accent: Accent
}

export type Category = {
  slug: 'hair-care' | 'skin-care' | 'supplements'
  name: string
  shortName: string
  intro: string
  families: Family[]
}

export type Product = {
  slug: string
  name: string
  category: Category['slug']
  family: string
  format?: string
  size?: string
  summary?: string
  /** Packaging photo from the brand's approved assets (Phase 3). Until then a labelled placeholder is shown. */
  image?: { src: string; alt: string }
  /** Product slug on the retail shop. Only products the shop sells have one, and only those get a Buy button. */
  shopSlug?: string
  status: 'sample' | 'approved'
}

export const categories: Category[] = [
  {
    slug: 'hair-care',
    name: 'Hair care',
    shortName: 'Hair',
    intro: 'Shampoos, conditioners, serums, tonics and oils for every hair type and concern, from hair loss to dryness.',
    families: [
      { slug: 'forte', name: 'Forte', focus: 'Intensive hair loss', accent: 'forte' },
      { slug: 'collagen-biotin', name: 'Collagen & Biotin', focus: 'Volume and fullness', accent: 'collagen' },
      { slug: 'keratin-argan', name: 'Keratin & Argan', focus: 'Damage repair', accent: 'keratin' },
      { slug: 'biotin', name: 'Biotin', focus: 'Hair loss', accent: 'brand' },
      { slug: 'caffeine-arginine', name: 'Caffeine & Arginine', focus: 'Hair loss', accent: 'brand' },
      { slug: 'black-garlic', name: 'Black Garlic', focus: 'Hair loss and thinning', accent: 'brand' },
      { slug: 'classic', name: 'Classic', focus: 'Hair loss', accent: 'brand' },
      { slug: 'quantum', name: 'Quantum', focus: 'Volume', accent: 'brand' },
      { slug: 'aqua-thermal', name: 'Aqua Thermal', focus: 'Dandruff', accent: 'brand' },
      { slug: 'nourishing-oils', name: 'Nourishing Oils', focus: 'Nourishment', accent: 'brand' },
      { slug: 'brow-lash-serum', name: 'Brow & Lash Serum', focus: 'Brows and lashes', accent: 'brand' },
    ],
  },
  {
    slug: 'skin-care',
    name: 'Skin care',
    shortName: 'Skin',
    intro: 'Cleansers, serums, moisturisers and sun protection for acne-prone, dry, sensitive and mature skin.',
    families: [
      { slug: 'hydra', name: 'Hydra', focus: 'Hydration', accent: 'hydra' },
      { slug: 'skin-expert', name: 'Skin Expert', focus: 'Targeted serums', accent: 'hydra' },
      { slug: 'acnium', name: 'Acnium', focus: 'Acne-prone skin', accent: 'brand' },
      { slug: 'age-reverse', name: 'Age Reverse', focus: 'Anti-wrinkle', accent: 'brand' },
      { slug: 'atopicare', name: 'Atopicare', focus: 'Dry and atopic-prone skin', accent: 'brand' },
      { slug: 'sun-care', name: 'Sun Care', focus: 'Sun protection', accent: 'brand' },
      { slug: 'gold-on-skin', name: 'Gold On Skin', focus: 'Body care', accent: 'brand' },
    ],
  },
  {
    slug: 'supplements',
    name: 'Supplements',
    shortName: 'Supplements',
    intro: 'Beauty supplements in tablet, sachet and powder form to support hair, skin and nails.',
    families: [
      { slug: 'collagen-powder', name: 'Collagen Powder', focus: 'Beauty from within', accent: 'brand' },
      { slug: 'collagen', name: 'Collagen', accent: 'brand' },
      { slug: 'beauty-booster', name: 'Beauty Booster', accent: 'brand' },
      { slug: 'hair-tablet', name: 'Hair Tablet', focus: 'Hair support', accent: 'brand' },
      { slug: 'skin-tablet', name: 'Skin Tablet', focus: 'Skin support', accent: 'brand' },
      { slug: 'keratin', name: 'Keratin', accent: 'brand' },
      { slug: 'biotin', name: 'Biotin', accent: 'brand' },
    ],
  },
]

/** Development samples only: names and shop links are real, descriptions follow in Phase 3. */
export const products: Product[] = [
  {
    slug: 'forte-serum',
    name: 'Forte Hair Serum',
    category: 'hair-care',
    family: 'forte',
    format: 'Serum',
    size: '50 ml',
    shopSlug: 'bioxcin-forte-serum-50-ml',
    status: 'sample',
  },
  {
    slug: 'collagen-biotin-conditioner',
    name: 'Collagen & Biotin Conditioner',
    category: 'hair-care',
    family: 'collagen-biotin',
    format: 'Conditioner',
    shopSlug: 'bioxcin-collagen-biotin-conditioner',
    status: 'sample',
  },
  {
    slug: 'black-garlic-shampoo',
    name: 'Black Garlic Shampoo',
    category: 'hair-care',
    family: 'black-garlic',
    format: 'Shampoo',
    status: 'sample',
  },
  {
    slug: 'hydra-toner',
    name: 'Hydra Toner',
    category: 'skin-care',
    family: 'hydra',
    format: 'Toner',
    shopSlug: 'bioxcin-hydra-toner',
    status: 'sample',
  },
  {
    slug: 'sun-care-stick-spf-50',
    name: 'Sun Care Stick SPF 50+',
    category: 'skin-care',
    family: 'sun-care',
    format: 'Sun stick',
    shopSlug: 'bioxcin-sun-care-stick-spf-50',
    status: 'sample',
  },
  {
    slug: 'collagen-beauty-powder',
    name: 'Collagen Beauty Powder',
    category: 'supplements',
    family: 'collagen-powder',
    format: 'Powder sachets',
    size: '30 × 11 g',
    shopSlug: 'bioxcin-powder-beauty-collagen-powder-satchet-30x11gr',
    status: 'sample',
  },
]

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)

export const getFamily = (category: Category, slug: string) => category.families.find((f) => f.slug === slug)

export const productsIn = (categorySlug: string, familySlug?: string) =>
  products.filter((p) => p.category === categorySlug && (!familySlug || p.family === familySlug))

export const getProduct = (categorySlug: string, familySlug: string, slug: string) =>
  products.find((p) => p.category === categorySlug && p.family === familySlug && p.slug === slug)

export const productHref = (p: Pick<Product, 'category' | 'family' | 'slug'>) => `/${p.category}/${p.family}/${p.slug}`

export const familyOf = (p: Product) => getFamily(getCategory(p.category)!, p.family)!
