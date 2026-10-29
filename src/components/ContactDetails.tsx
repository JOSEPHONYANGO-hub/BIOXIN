import { contact, shown } from '@/lib/site'
import { SocialLinks } from './layout/Footer'
import { Icon, type IconName } from './Icon'

/** Approved contact details as a list; anything not yet approved is simply left out. */
export function ContactDetails() {
  const rows: Array<{ icon: IconName; label: string; value: string | null; href?: string; external?: boolean }> = [
    { icon: 'phone', label: 'Phone', value: shown(contact.phone), href: contact.phoneHref },
    { icon: 'whatsapp', label: 'WhatsApp', value: shown(contact.whatsapp), href: contact.whatsappHref, external: true },
    { icon: 'mail', label: 'Email', value: shown(contact.email), href: `mailto:${contact.email.value}` },
    { icon: 'pin', label: 'Office', value: shown(contact.address) },
    { icon: 'clock', label: 'Opening hours', value: shown(contact.hours) },
  ]
  return (
    <div>
      <ul className="space-y-5">
        {rows
          .filter((r) => r.value)
          .map((r) => (
            <li key={r.label} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
                <Icon name={r.icon} />
              </span>
              <div>
                <p className="text-sm font-semibold text-muted">{r.label}</p>
                <p className="mt-0.5 break-words text-ink">
                  {r.href ? (
                    <a
                      href={r.href}
                      {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="font-medium text-brand hover:underline"
                    >
                      {r.value}
                      {r.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                    </a>
                  ) : (
                    r.value
                  )}
                </p>
              </div>
            </li>
          ))}
      </ul>
      <div className="mt-6 rounded-lg bg-brand p-2 text-white">
        <p className="px-3 pt-2 text-sm font-semibold">Follow us</p>
        <SocialLinks />
      </div>
    </div>
  )
}
