import { PageHeader, PendingNotice, Section, SectionHeading } from '@/components/ui'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Science & ingredients',
  description: 'The ingredients and technologies behind Bioxcin hair care, skin care and supplements, and guides to choosing your routine.',
  path: '/science',
})

// Topics confirmed on bioxcin.com.tr; approved English content for each follows in Phase 3.
const topics = [
  { title: 'Key ingredients', text: 'What goes into each range, and what each ingredient is for.' },
  { title: 'Formulation technology', text: 'How Bioxcin products are formulated and developed.' },
  { title: 'Research & testing', text: 'How products are tested, with approved study summaries.' },
  { title: 'Hair loss guide', text: 'Understanding hair loss and choosing a suitable routine.' },
  { title: 'Skin care guides', text: 'Routines for acne-prone, dry, sensitive and mature skin.' },
  { title: 'Sun protection', text: 'Choosing and using sun care for your skin type.' },
]

export default function SciencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Science & education"
        title="Science & ingredients"
        intro="Learn about the ingredients and technologies behind Bioxcin, and how to build the right routine for your hair and skin."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Science & ingredients' }]}
      />
      <Section aria-labelledby="topics-heading">
        <div className="mb-8 max-w-3xl">
          <PendingNotice>
            Only claims approved for Kenya will be published here. Each topic below is a placeholder until its content is approved.
          </PendingNotice>
        </div>
        <SectionHeading id="topics-heading" title="Topics" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <li key={t.title} className="rounded-xl border border-line p-6">
              <span className="mb-4 block h-1.5 w-10 rounded-full bg-accent" aria-hidden="true" />
              <h3 className="text-lg">{t.title}</h3>
              <p className="mt-2 text-sm text-muted">{t.text}</p>
              <p className="mt-4 text-xs font-medium text-muted">Coming soon</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
