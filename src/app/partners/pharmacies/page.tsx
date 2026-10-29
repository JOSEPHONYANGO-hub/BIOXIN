import { PartnerPage } from '@/components/PartnerPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Pharmacies & retailers',
  description: 'Stock Bioxcin hair care, skin care and supplements in your pharmacy or shop in Kenya. Send us a business enquiry.',
  path: '/partners/pharmacies',
})

export default function PharmaciesPage() {
  return (
    <PartnerPage
      kind="pharmacy"
      path="/partners/pharmacies"
      title="Pharmacies & retailers"
      intro="Pharmacies, beauty shops and retailers across Kenya can enquire about stocking the Bioxcin range."
      points={[
        'A reply from our team about stocking Bioxcin products',
        'Information on the available product range',
        'Support for your staff and customers',
      ]}
    />
  )
}
