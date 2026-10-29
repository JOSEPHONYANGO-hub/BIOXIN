import { LegalPage } from '@/components/LegalPage'
import { pageMeta } from '@/lib/seo'
import { operatorName } from '@/lib/site'

export const metadata = pageMeta({
  title: 'Terms of use',
  description: 'Terms of use for bioxcin.co.ke.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <h2>About this website</h2>
      <p>
        This website gives information about Bioxcin products available in Kenya and is operated by {operatorName}. Purchases are made
        through our online shop, under that shop&apos;s own terms.
      </p>
      <h2>Product information</h2>
      <p>Product information on this site is for general guidance. For medical concerns, please speak to a doctor or pharmacist.</p>
      <h2>Trademarks</h2>
      <p>Bioxcin and the Bioxcin logo are trademarks of their owner and are used with permission.</p>
    </LegalPage>
  )
}
