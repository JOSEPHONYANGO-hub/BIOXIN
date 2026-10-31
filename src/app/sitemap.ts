import type { MetadataRoute } from 'next'
import { categories, productHref, products } from '@/lib/catalog'
import { siteUrl } from '@/lib/site'

const staticPaths = ['/', '/about', '/science', '/contact', '/partners/pharmacies', '/partners/distributors', '/privacy', '/cookies', '/terms']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((p) => ({ url: `${siteUrl}${p === '/' ? '' : p}` })),
    ...categories.flatMap((c) => [{ url: `${siteUrl}/${c.slug}` }, ...c.families.map((f) => ({ url: `${siteUrl}/${c.slug}/${f.slug}` }))]),
    // Development samples are left out until their approved content is in.
    ...products.map((p) => ({ url: `${siteUrl}${productHref(p)}` })),
  ]
}
