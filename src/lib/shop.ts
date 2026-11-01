import { cache } from 'react'
import { type Category, categories, type Product, type ProductInfo } from './catalog'
import { eloriaSnapshot } from './eloria-snapshot'
import { productInfo } from './product-info'
import { shopUrl } from './site'

/** One listing as returned by the Eloria shop's public products API. */
export type ShopListing = {
  name: string
  slug: string
  price: string | number
  salePrice: string | number | null
  stockStatus?: string
  images?: string[]
  brand?: { slug?: string } | null
}

/** How often the site re-reads prices and stock from the shop, in seconds. */
export const SHOP_REVALIDATE = 600

const PAGE_SIZE = 48 // the shop's maximum page size
const OTHER_BRANDS = /\b(procsin|thalia|restorex|bioblas)\b/i

async function fetchPage(page: number) {
  const url = `${shopUrl}/api/products?brand=bioxcin&take=${PAGE_SIZE}&page=${page}`
  const res = await fetch(url, { next: { revalidate: SHOP_REVALIDATE }, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Shop responded ${res.status}`)
  return (await res.json()) as { products: ShopListing[]; pages: number }
}

/** All Bioxcin listings on the shop, or the bundled snapshot if the shop cannot be reached. */
async function fetchListings(): Promise<ShopListing[]> {
  try {
    const first = await fetchPage(1)
    const rest = await Promise.all(Array.from({ length: Math.max(first.pages - 1, 0) }, (_, i) => fetchPage(i + 2)))
    const all = [first, ...rest].flatMap((p) => p.products)
    if (!all.length) throw new Error('Shop returned no products')
    return all
  } catch (error) {
    console.warn(`[shop] using bundled product snapshot: ${error instanceof Error ? error.message : 'unknown error'}`)
    return eloriaSnapshot
  }
}

const isBioxcin = (l: ShopListing) => l.brand?.slug === 'bioxcin' && !OTHER_BRANDS.test(l.name)

/** Tidy a raw shop name such as "Bioxcin,shampoo,biotin shampoo,300ml" for display. */
function cleanName(raw: string) {
  const parts = raw
    .replace(/^bioxcin[\s,]*/i, '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
  const main = parts.length > 1 ? parts[1] : parts[0] || raw
  return main.replace(/\b\w/g, (c) => c.toUpperCase())
}

const keywordFamilies: Array<[RegExp, Category['slug'], string]> = [
  [/forte/i, 'hair-care', 'forte'],
  [/collagen.?biotin/i, 'hair-care', 'collagen-biotin'],
  [/keratin.?argan/i, 'hair-care', 'keratin-argan'],
  [/nourishing/i, 'hair-care', 'nourishing-oils'],
  [/black garlic/i, 'hair-care', 'black-garlic'],
  [/quantum/i, 'hair-care', 'quantum'],
  [/caffeine/i, 'hair-care', 'caffeine-arginine'],
  [/dandruff|aqua thermal/i, 'hair-care', 'aqua-thermal'],
  [/eyelash|eyebrow/i, 'hair-care', 'brow-lash-serum'],
  [/biotin/i, 'hair-care', 'biotin'],
  [/hydra/i, 'skin-care', 'hydra'],
  [/acnium/i, 'skin-care', 'acnium'],
  [/age reverse|wrinkle/i, 'skin-care', 'age-reverse'],
  [/atopic/i, 'skin-care', 'atopicare'],
  [/sun|spf/i, 'skin-care', 'sun-care'],
  [/gold on skin/i, 'skin-care', 'gold-on-skin'],
  [/powder|sachet|satchet/i, 'supplements', 'collagen-powder'],
  [/tablet/i, 'supplements', 'hair-tablet'],
  [/serum/i, 'skin-care', 'skin-expert'],
  [/shampoo|conditioner|hair/i, 'hair-care', 'classic'],
]

/** Fallback for listings added to the shop after the curated details were written. */
function guessInfo(l: ShopListing): ProductInfo {
  const [, category, family] = keywordFamilies.find(([re]) => re.test(l.name)) ?? [null, 'skin-care', 'body-care']
  const name = cleanName(l.name)
  return {
    slug: l.slug.replace(/^bioxcin-/, ''),
    name,
    category,
    family,
    type: '',
    needs: [],
    summary: `Bioxcin ${name}.`,
    images: [],
    benefits: [],
    ingredients: [],
    howToUse: 'Use as directed on the pack.',
  }
}

const toNumber = (v: string | number | null | undefined) => (v === null || v === undefined || v === '' ? null : Number(v))

/** Every Bioxcin product sold on the shop, with live prices. Cached per request and for SHOP_REVALIDATE seconds. */
export const getProducts = cache(async (): Promise<Product[]> => {
  const listings = (await fetchListings()).filter(isBioxcin)
  const seen = new Set<string>()
  const products: Product[] = []
  for (const l of listings) {
    if (seen.has(l.slug)) continue
    seen.add(l.slug)
    const info = productInfo[l.slug] ?? guessInfo(l)
    const shopImage = l.images?.find((src) => /^https:\/\//.test(src))
    products.push({
      ...info,
      images: info.images.length ? info.images : shopImage ? [{ src: shopImage, alt: `Bioxcin ${info.name}` }] : [],
      shopSlug: l.slug,
      price: toNumber(l.price) ?? 0,
      salePrice: toNumber(l.salePrice),
      inStock: l.stockStatus !== 'OUT_OF_STOCK',
    })
  }
  return products
})

export async function findProduct(categorySlug: string, familySlug: string, slug: string) {
  return (await getProducts()).find((p) => p.category === categorySlug && p.family === familySlug && p.slug === slug)
}

/** Categories with only the families that have products, for menus. */
export async function getMenuCategories() {
  const products = await getProducts()
  return categories.map((c) => ({
    ...c,
    families: c.families.filter((f) => products.some((p) => p.category === c.slug && p.family === f.slug)),
    needs: c.needs.filter((n) => products.some((p) => p.category === c.slug && p.needs.includes(n.slug))),
    types: c.types.filter((t) => products.some((p) => p.category === c.slug && p.type === t.slug)),
  }))
}
