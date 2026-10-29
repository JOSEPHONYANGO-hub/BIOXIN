import 'server-only'
import { headers } from 'next/headers'
import { z } from 'zod'
import { businessTypes, contactSubjects } from './form-options'
import { rateLimit } from './rate-limit'

/** Common checks for every public form: honeypot, timing and a per-IP rate limit. */

export type FormState = { ok: true; dryRun: boolean } | { ok: false; message: string; fieldErrors?: Record<string, string> } | null

export async function clientIp() {
  const h = await headers()
  return (h.get('cf-connecting-ip') || h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown').trim()
}

export async function guard(form: FormData, bucket: string, limit = 5, windowMs = 10 * 60_000): Promise<string | null> {
  // Honeypot: real people never see or fill the "website" field.
  if (String(form.get('website') ?? '').trim()) return 'Your submission could not be accepted.'
  // Bots often submit instantly; a person needs at least a couple of seconds.
  const startedAt = Number(form.get('startedAt') || 0)
  if (startedAt && Date.now() - startedAt < 2500) return 'Please take a moment to check your details, then submit again.'

  // FORM_RATE_LIMIT_FACTOR raises limits for local automated tests only; production leaves it unset.
  const factor = Math.max(1, Number(process.env.FORM_RATE_LIMIT_FACTOR) || 1)
  const limited = rateLimit(`${bucket}:${await clientIp()}`, limit * factor, windowMs)
  if (!limited.ok) return 'Too many submissions from your connection. Please wait a few minutes and try again.'
  return null
}

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (!out[key]) out[key] = issue.message
  }
  return out
}

// Single-line text: no line breaks, so values are safe in email subjects.
const line = (label: string, min = 2, max = 100) =>
  z
    .string()
    .trim()
    .transform((v) => v.replace(/[\r\n]+/g, ' '))
    .pipe(z.string().min(min, `Enter ${label}`).max(max, `${label[0].toUpperCase()}${label.slice(1)} is too long`))

// Kenyan and international numbers: 07xx/01xx (10 digits) or +country code.
const phone = z
  .string()
  .trim()
  .min(1, 'Enter your phone number')
  .regex(/^(\+?\d[\d\s-]{7,16}\d)$/, 'Enter a valid phone number, e.g. 0712 345 678')

const base = {
  name: line('your name'),
  email: z.string().trim().min(1, 'Enter your email address').pipe(z.email('Enter a valid email address, e.g. name@example.com')),
  phone,
  message: z.string().trim().max(2000, 'Keep your message under 2,000 characters').optional().default(''),
  consent: z.literal('on', { error: 'Please confirm you agree to us using your details to reply' }),
}

export const contactSchema = z.object({
  ...base,
  subject: z.enum(contactSubjects, { error: 'Choose what your message is about' }),
  message: z.string().trim().min(5, 'Enter your message').max(2000, 'Keep your message under 2,000 characters'),
})

export const pharmacySchema = z.object({
  ...base,
  businessName: line('your business name'),
  businessType: z.enum(businessTypes, { error: 'Choose your type of business' }),
  location: line('your town or county'),
})

export const distributorSchema = z.object({
  ...base,
  companyName: line('your company name'),
  regions: line('the regions you cover', 2, 200),
})

export type EnquiryKind = 'contact' | 'pharmacy' | 'distributor'
