'use server'

import {
  contactSchema,
  distributorSchema,
  fieldErrors,
  guard,
  pharmacySchema,
  type EnquiryKind,
  type FormState,
} from '@/lib/forms'
import { sendEnquiryEmail } from '@/lib/mailer'
import { contact, enquiryRecipients, shown } from '@/lib/site'

const schemas = { contact: contactSchema, pharmacy: pharmacySchema, distributor: distributorSchema }

const labels: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  subject: 'Subject',
  businessName: 'Business name',
  businessType: 'Business type',
  location: 'Town / county',
  companyName: 'Company',
  regions: 'Regions covered',
  message: 'Message',
}

const subjectFor = (kind: EnquiryKind, d: Record<string, string>) =>
  kind === 'pharmacy'
    ? `Pharmacy/retailer enquiry: ${d.businessName}`
    : kind === 'distributor'
      ? `Distributor enquiry: ${d.companyName}`
      : `Website enquiry: ${d.subject}`

export async function submitEnquiry(_prev: FormState, form: FormData): Promise<FormState> {
  const kind = String(form.get('kind')) as EnquiryKind
  const schema = schemas[kind]
  if (!schema) return { ok: false, message: 'This form could not be sent. Please refresh the page and try again.' }

  const blocked = await guard(form, `enquiry:${kind}`)
  if (blocked) return { ok: false, message: blocked }

  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return { ok: false, message: 'Please check the highlighted fields.', fieldErrors: fieldErrors(parsed.error) }

  const data = parsed.data as Record<string, string>
  const text = [
    ...Object.entries(labels)
      .filter(([key]) => key in data && data[key])
      .map(([key, label]) => `${label}: ${data[key]}`),
    '',
    `Sent from the bioxcin.co.ke ${kind} form. The sender agreed to be contacted about this enquiry.`,
  ].join('\n')

  try {
    const result = await sendEnquiryEmail({
      to: enquiryRecipients[kind],
      subject: subjectFor(kind, data),
      text,
      replyTo: data.email,
      kind,
    })
    return { ok: true, dryRun: result.dryRun }
  } catch (err) {
    console.error(`[enquiry] ${kind} enquiry could not be sent: ${(err as Error).message}`)
    const phone = shown(contact.phone)
    return {
      ok: false,
      message: `Sorry, your message could not be sent right now. Please try again later${phone ? ` or call us on ${phone}` : ''}.`,
    }
  }
}
