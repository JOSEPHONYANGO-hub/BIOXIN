import type { Metadata } from 'next'

/** Per-page title, description and canonical URL (relative to metadataBase). */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { ...(title ? { title } : {}), description, url: path },
  }
}
