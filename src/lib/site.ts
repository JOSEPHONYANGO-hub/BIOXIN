/**
 * Every Kenyan business detail shown on the site lives here, so changing a number or a social
 * account is a one-line edit. Only values marked `approved: true` are ever rendered: anything
 * still waiting on the business stays hidden instead of showing a fake number or address.
 */

export const siteName = 'Bioxcin Kenya'
export const brandName = 'Bioxcin'

/** Public operating name. The registered company name is deliberately never shown on the site. */
export const operatorName = 'Eloria Beauty'

/** Staging deployments are hidden from search engines and clearly labelled. */
export const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production'

export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export const seoDefaults = {
  title: 'Bioxcin Kenya | Hair care, skin care and supplements',
  description:
    'Bioxcin hair care, skin care and beauty supplements in Kenya. Explore the product families and where to buy.',
  locale: 'en_KE',
}

type Detail<T = string> = { value: T; approved: boolean }

/** Approved by Joseph on 29 Oct 2026: use Eloria Beauty's public contact details. */
export const contact = {
  phone: { value: '0793 200 000', approved: true } as Detail,
  phoneHref: 'tel:+254793200000',
  whatsapp: { value: '+254 793 200 000', approved: true } as Detail,
  whatsappHref: 'https://wa.me/254793200000',
  email: { value: 'info@eloriabeauty.co.ke', approved: true } as Detail,
  address: {
    value: 'Kenafrica Business Park, Tower B, 3rd Floor, Office 5, Ruaraka, Nairobi',
    approved: true,
  } as Detail,
  hours: { value: 'Monday to Saturday, 8:00am to 5:00pm', approved: true } as Detail,
}

export type SocialLink = { label: string; href: string; approved: boolean }

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61575638121262', approved: true },
  { label: 'Instagram', href: 'https://www.instagram.com/eloriabeauty/', approved: true },
  { label: 'TikTok', href: 'https://www.tiktok.com/@eloriabeauty_ke', approved: true },
]

/** Returns the value only when it has been approved for public display. */
export const shown = <T,>(detail: Detail<T>) => (detail.approved ? detail.value : null)

export const approvedSocialLinks = socialLinks.filter((s) => s.approved)

/** Where each enquiry type is delivered. All go to one inbox for now; split later if needed. */
export const enquiryRecipients = {
  contact: process.env.ENQUIRY_TO || 'info@eloriabeauty.co.ke',
  pharmacy: process.env.ENQUIRY_TO || 'info@eloriabeauty.co.ke',
  distributor: process.env.ENQUIRY_TO || 'info@eloriabeauty.co.ke',
}

/** Purchase links go to the retail shop; the source tag lets the shop see sales from this site. */
export const shopUrl = 'https://eloriabeauty.co.ke'
export const buyLink = (shopSlug: string) =>
  `${shopUrl}/products/${encodeURIComponent(shopSlug)}?utm_source=bioxcin.co.ke&utm_medium=referral`

export type NavItem = { label: string; href: string; description?: string; children?: NavItem[] }

export const partnerNav: NavItem[] = [
  { label: 'Pharmacies & retailers', href: '/partners/pharmacies', description: 'Stock Bioxcin in your pharmacy or shop' },
  { label: 'Distributors & wholesale', href: '/partners/distributors', description: 'Regional distribution and bulk supply' },
]

export const footerLinks: NavItem[] = [
  { label: 'About Bioxcin', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Cookie policy', href: '/cookies' },
  { label: 'Terms of use', href: '/terms' },
]

/** Announcement shown above the header on every page. */
export const announcement = `${siteName} | Marketed & Distributed by ${operatorName}`

/**
 * Which purchase buttons product pages show:
 * - 'both': "Buy now" where the shop sells the product, plus a WhatsApp enquiry on every product
 * - 'whatsapp': only the WhatsApp enquiry
 * - 'buy': only "Buy now", and nothing for products the shop does not sell
 */
export const productCta: 'both' | 'whatsapp' | 'buy' = 'both'

/** Pre-filled WhatsApp enquiry about one product. */
export const whatsappEnquiryLink = (productName: string) =>
  `${contact.whatsappHref}?text=${encodeURIComponent(`Hi ${operatorName}, I would like to inquire about Bioxcin ${productName}`)}`
