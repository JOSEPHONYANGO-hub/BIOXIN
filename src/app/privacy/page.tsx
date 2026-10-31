import Link from 'next/link'
import { LegalPage } from '@/components/LegalPage'
import { pageMeta } from '@/lib/seo'
import { contact, operatorName, shown } from '@/lib/site'

export const metadata = pageMeta({
  title: 'Privacy policy',
  description: 'How bioxcin.co.ke collects and uses personal information sent through the website.',
  path: '/privacy',
})

export default function PrivacyPage() {
  const email = shown(contact.email)
  return (
    <LegalPage title="Privacy policy">
      <h2>Who we are</h2>
      <p>This website is operated by {operatorName}, which brings the Bioxcin range to Kenya.</p>
      <h2>What we collect</h2>
      <p>
        When you send us a message, we collect the details you enter in the form: your name, phone number, email
        address and your message.
      </p>
      <h2>How we use it</h2>
      <p>We use these details only to reply to your message or enquiry. They are sent to our team by email.</p>
      <h2>Cookies</h2>
      <p>
        See our <Link href="/cookies">cookie policy</Link>.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask us to see, correct or delete the details you have sent us{email ? <> by emailing <a href={`mailto:${email}`}>{email}</a></> : null}.
      </p>
    </LegalPage>
  )
}
