import { LegalPage } from '@/components/LegalPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Cookie policy',
  description: 'How bioxcin.co.ke uses cookies.',
  path: '/cookies',
})

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie policy">
      <h2>Cookies on this website</h2>
      <p>This website does not currently set any analytics or advertising cookies.</p>
      <p>
        If analytics are added in future, they will only run after you agree to them, and this page will list each cookie and its
        purpose.
      </p>
    </LegalPage>
  )
}
