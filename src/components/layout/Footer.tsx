import Link from 'next/link'
import { categories } from '@/lib/catalog'
import { approvedSocialLinks, contact, footerLinks, operatorName, partnerNav, shown } from '@/lib/site'
import { Icon, type IconName } from '../Icon'
import { Container } from '../ui'
import { Wordmark } from './Header'

const socialIcon: Record<string, IconName> = { Facebook: 'facebook', Instagram: 'instagram', TikTok: 'tiktok' }

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {approvedSocialLinks.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-11 items-center justify-center rounded-full hover:bg-white/10"
          >
            <Icon name={socialIcon[s.label] ?? 'arrowRight'} className="size-5" />
            <span className="sr-only">{s.label} (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Slim contact bar above the header: phone, WhatsApp and opening hours. */
export function UtilityBar() {
  const phone = shown(contact.phone)
  const whatsapp = shown(contact.whatsapp)
  const hours = shown(contact.hours)
  return (
    <div className="bg-brand-dark text-xs text-white">
      <Container className="flex min-h-10 items-center justify-between gap-4">
        <ul className="flex items-center gap-4 sm:gap-6">
          {phone ? (
            <li>
              <a href={contact.phoneHref} className="flex min-h-10 items-center gap-1.5 hover:underline">
                <Icon name="phone" className="size-4" />
                <span className="sr-only">Call us on </span>
                {phone}
              </a>
            </li>
          ) : null}
          {whatsapp ? (
            <li>
              <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-1.5 hover:underline">
                <Icon name="whatsapp" className="size-4" />
                WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ) : null}
        </ul>
        {hours ? (
          <p className="hidden items-center gap-1.5 md:flex">
            <Icon name="clock" className="size-4" />
            {hours}
          </p>
        ) : null}
      </Container>
    </div>
  )
}

export function Footer() {
  const phone = shown(contact.phone)
  const email = shown(contact.email)
  const address = shown(contact.address)
  const hours = shown(contact.hours)
  const whatsapp = shown(contact.whatsapp)
  return (
    <footer className="bg-brand text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark onDark />
          <p className="mt-4 max-w-sm text-sm text-white/85">
            Hair care, skin care and beauty supplements, brought to Kenya by {operatorName}.
          </p>
          <SocialLinks className="mt-5 -ml-3" />
        </div>

        <nav aria-label="Products" className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">Products</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-white/85 hover:text-white hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-sm font-semibold tracking-wide text-white uppercase">For business</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {partnerNav.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-white/85 hover:text-white hover:underline">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Information" className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">Information</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/85 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-4">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            {phone ? (
              <li className="flex gap-3">
                <Icon name="phone" className="mt-0.5 size-4 shrink-0" />
                <a href={contact.phoneHref} className="hover:text-white hover:underline">
                  {phone}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li className="flex gap-3">
                <Icon name="whatsapp" className="mt-0.5 size-4 shrink-0" />
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                  WhatsApp {whatsapp}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ) : null}
            {email ? (
              <li className="flex gap-3">
                <Icon name="mail" className="mt-0.5 size-4 shrink-0" />
                <a href={`mailto:${email}`} className="break-all hover:text-white hover:underline">
                  {email}
                </a>
              </li>
            ) : null}
            {address ? (
              <li className="flex gap-3">
                <Icon name="pin" className="mt-0.5 size-4 shrink-0" />
                <span>{address}</span>
              </li>
            ) : null}
            {hours ? (
              <li className="flex gap-3">
                <Icon name="clock" className="mt-0.5 size-4 shrink-0" />
                <span>{hours}</span>
              </li>
            ) : null}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-6 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {operatorName}. Bioxcin is a registered trademark of its owner, used with permission.
          </p>
          <p>
            <Link href="/privacy" className="hover:text-white hover:underline">
              Privacy
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/cookies" className="hover:text-white hover:underline">
              Cookies
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/terms" className="hover:text-white hover:underline">
              Terms
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  )
}
