import { ContactDetails } from '@/components/ContactDetails'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { ArrowLink, Container, PageHeader } from '@/components/ui'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Contact us',
  description: 'Questions about Bioxcin products in Kenya? Call, WhatsApp or email us, or send a message using the form.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact us"
        intro="Questions about a product or which range is right for you? Send us a message and our team will reply."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-12">
        <section aria-labelledby="form-heading" className="lg:col-span-7">
          <h2 id="form-heading" className="mb-6 text-2xl">
            Send a message
          </h2>
          <EnquiryForm kind="contact" />
        </section>
        <aside aria-labelledby="details-heading" className="lg:col-span-5">
          <h2 id="details-heading" className="mb-6 text-2xl">
            Get in touch
          </h2>
          <ContactDetails />
          <div className="mt-8 rounded-xl border border-line p-6">
            <p className="font-semibold text-brand">Are you a pharmacy, retailer or distributor?</p>
            <p className="mt-1 text-sm text-muted">Use our business enquiry forms so the right team can reply.</p>
            <div className="mt-4 flex flex-col gap-2">
              <ArrowLink href="/partners/pharmacies">Pharmacies & retailers</ArrowLink>
              <ArrowLink href="/partners/distributors">Distributors & wholesale</ArrowLink>
            </div>
          </div>
        </aside>
      </Container>
    </>
  )
}
