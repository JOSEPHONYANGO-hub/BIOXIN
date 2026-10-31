import type { ReactNode } from 'react'
import { Container, PageHeader } from '@/components/ui'

/** Layout for legal pages. */
export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <>
      <PageHeader title={title} crumbs={[{ label: 'Home', href: '/' }, { label: title }]} />
      <Container className="py-12 sm:py-16">
        <div className="prose-bx">
          {updated ? <p className="text-sm text-muted">Last updated: {updated}</p> : null}
          {children}
        </div>
      </Container>
    </>
  )
}
