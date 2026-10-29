import { ContactDetails } from '@/components/ContactDetails'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { Container, PageHeader } from '@/components/ui'
import { Icon } from './Icon'
import type { EnquiryKind } from '@/lib/forms'
import { partnerNav } from '@/lib/site'
import Link from 'next/link'

/**
 * Shared layout for the business enquiry pages. These use the dark "For business" styling so they
 * read as separate from consumer product pages.
 */
export function PartnerPage({
  kind,
  title,
  intro,
  points,
  path,
}: {
  kind: Extract<EnquiryKind, 'pharmacy' | 'distributor'>
  title: string
  intro: string
  points: string[]
  path: string
}) {
  return (
    <>
      <PageHeader
        tone="brand"
        eyebrow="For business"
        title={title}
        intro={intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'For business' }, { label: title }]}
      />
      <nav aria-label="Business enquiries" className="border-b border-line bg-surface">
        <Container>
          <ul className="flex gap-1 overflow-x-auto py-2">
            {partnerNav.map((p) => (
              <li key={p.href} className="shrink-0">
                <Link
                  href={p.href}
                  aria-current={p.href === path ? 'page' : undefined}
                  className="flex min-h-11 items-center rounded-md px-4 text-sm font-semibold text-brand hover:bg-white aria-[current=page]:bg-white aria-[current=page]:shadow-sm"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-12">
        <section aria-labelledby="enquiry-heading" className="lg:col-span-7">
          <h2 id="enquiry-heading" className="text-2xl">
            Send a business enquiry
          </h2>
          <p className="mt-2 mb-6 text-muted">Tell us about your business and we&apos;ll be in touch.</p>
          <EnquiryForm kind={kind} />
        </section>
        <aside aria-labelledby="why-heading" className="space-y-8 lg:col-span-5">
          <div className="rounded-xl bg-surface p-6">
            <h2 id="why-heading" className="text-xl">
              What to expect
            </h2>
            <ul className="mt-4 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-ink">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent-ink" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <ContactDetails />
        </aside>
      </Container>
    </>
  )
}
