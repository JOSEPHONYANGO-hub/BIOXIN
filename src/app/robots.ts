import type { MetadataRoute } from 'next'
import { isProduction, siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Staging and preview deployments are closed to crawlers entirely.
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${siteUrl}/sitemap.xml` }
}
