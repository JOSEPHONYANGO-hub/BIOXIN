import 'server-only'
import { createTransport, type Transporter } from 'nodemailer'

/**
 * Sends enquiry emails over SMTP. Until MESSAGING_MODE=live (and the SMTP settings are filled in
 * Coolify), nothing is sent: the enquiry is only noted in the server log, without personal data.
 */
export const isLive = () => process.env.MESSAGING_MODE === 'live'

let transport: Transporter | null = null

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error('SMTP is not configured')
  const port = Number(SMTP_PORT) || 587
  transport ??= createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return transport
}

export async function sendEnquiryEmail(input: { to: string; subject: string; text: string; replyTo: string; kind: string }) {
  if (!isLive()) {
    console.info(`[enquiry] dry-run: ${input.kind} enquiry received at ${new Date().toISOString()} (not sent)`)
    return { dryRun: true }
  }
  await getTransport().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
  })
  return { dryRun: false }
}
