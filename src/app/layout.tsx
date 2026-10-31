import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter'
import './globals.css'
import { Footer, UtilityBar } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { JsonLd } from '@/components/JsonLd'
import { categories } from '@/lib/catalog'
import { approvedSocialLinks, contact, isProduction, seoDefaults, shown, siteName, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seoDefaults.title, template: `%s | ${siteName}` },
  description: seoDefaults.description,
  applicationName: siteName,
  openGraph: { type: 'website', siteName, locale: seoDefaults.locale, url: '/' },
  twitter: { card: 'summary_large_image' },
  // Staging and local builds must never be indexed.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#003b73',
  width: 'device-width',
  initialScale: 1,
}

const menuCategories = categories.map((c) => ({
  slug: c.slug,
  name: c.name,
  image: c.image,
  needs: c.needs,
  types: c.types,
  families: c.families.map((f) => ({ slug: f.slug, name: f.name, focus: f.focus, accent: f.accent })),
}))

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  email: shown(contact.email) ?? undefined,
  telephone: shown(contact.phone) ? contact.phoneHref.replace('tel:', '') : undefined,
  address: shown(contact.address)
    ? { '@type': 'PostalAddress', streetAddress: contact.address.value, addressLocality: 'Nairobi', addressCountry: 'KE' }
    : undefined,
  sameAs: approvedSocialLinks.map((s) => s.href),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-brand px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        {!isProduction ? (
          <p className="bg-keratin px-4 py-1.5 text-center text-xs font-semibold text-ink">
            Preview site: content is still being prepared and is not final.
          </p>
        ) : null}
        <UtilityBar />
        <header className="sticky top-0 z-40">
          <Header categories={menuCategories} />
        </header>
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd data={organization} />
      </body>
    </html>
  )
}
