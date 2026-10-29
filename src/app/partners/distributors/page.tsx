import { PartnerPage } from '@/components/PartnerPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Distributors & wholesale',
  description: 'Interested in distributing Bioxcin products in Kenya or the region? Send us a distributor or wholesale enquiry.',
  path: '/partners/distributors',
})

export default function DistributorsPage() {
  return (
    <PartnerPage
      kind="distributor"
      path="/partners/distributors"
      title="Distributors & wholesale"
      intro="Distributors and wholesalers can enquire about supplying Bioxcin products in their region."
      points={[
        'A reply from our team about distribution opportunities',
        'Information on the product range and supply',
        'A single point of contact for your enquiry',
      ]}
    />
  )
}
