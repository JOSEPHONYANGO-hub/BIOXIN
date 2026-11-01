import type { MetadataRoute } from 'next'
import { categories, familiesWithProducts, productHref } from '@/lib/catalog'
import { getProducts } from '@/lib/shop'
import { siteUrl } from '@/lib/site'

const staticPaths = ['/', '/about', '/contact', '/privacy', '/cookies', '/terms']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  return [
    ...staticPaths.map((p) => ({ url: `${siteUrl}${p === '/' ? '' : p}` })),
    ...categories.flatMap((c) => [
      { url: `${siteUrl}/${c.slug}` },
      ...familiesWithProducts(products, c).map((f) => ({ url: `${siteUrl}/${c.slug}/${f.slug}` })),
    ]),
    ...products.map((p) => ({ url: `${siteUrl}${productHref(p)}` })),
  ]
}
