import { ArrowLink, PageHeader, PendingNotice, Section, SectionHeading } from '@/components/ui'
import { categories } from '@/lib/catalog'
import { pageMeta } from '@/lib/seo'
import { operatorName } from '@/lib/site'

export const metadata = pageMeta({
  title: 'About Bioxcin',
  description: `About Bioxcin and the Bioxcin range in Kenya, brought to you by ${operatorName}.`,
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="About Bioxcin"
        intro="Hair care, skin care and beauty supplements, now available in Kenya."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />
      <Section>
        <div className="prose-bx">
          <PendingNotice>The approved Bioxcin brand story will be added here in the next phase.</PendingNotice>
          <h2>Bioxcin in Kenya</h2>
          <p>
            The Bioxcin range is brought to Kenya by {operatorName}. This site is your guide to the Bioxcin product families, the
            ingredients behind them and how to choose the right products for your hair and skin.
          </p>
        </div>
      </Section>
      <Section tone="surface" aria-labelledby="ranges-heading">
        <SectionHeading id="ranges-heading" title="Explore the range" />
        <ul className="grid gap-6 md:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug} className="rounded-xl bg-white p-6 ring-1 ring-line">
              <h3 className="text-xl">{c.name}</h3>
              <p className="mt-2 text-muted">{c.intro}</p>
              <div className="mt-4">
                <ArrowLink href={`/${c.slug}`}>View {c.name.toLowerCase()}</ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
