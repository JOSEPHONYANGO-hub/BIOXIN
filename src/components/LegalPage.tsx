import type { ReactNode } from 'react'
import { Container, PageHeader, PendingNotice } from '@/components/ui'

/** Layout for legal pages. Drafts show a clear notice until the approved text replaces them. */
export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <>
      <PageHeader title={title} crumbs={[{ label: 'Home', href: '/' }, { label: title }]} />
      <Container className="py-12 sm:py-16">
        <div className="prose-bx">
          <PendingNotice>
            This is a draft that describes how the website currently works. The approved {title.toLowerCase()} will replace it
            before launch.
          </PendingNotice>
          {updated ? <p className="mt-6 text-sm text-muted">Last updated: {updated}</p> : null}
          {children}
        </div>
      </Container>
    </>
  )
}
