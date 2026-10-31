'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { submitEnquiry } from '@/app/actions'
import type { EnquiryKind, FormState } from '@/lib/forms'
import { contactSubjects } from '@/lib/form-options'
import { Icon } from '../Icon'
import { buttonStyles, cx } from '../ui'

const inputClass =
  'mt-1.5 block w-full min-h-11 rounded-md border border-slate-400 bg-white px-3 py-2 text-base text-ink placeholder:text-slate-500 focus:border-brand aria-[invalid=true]:border-red-700'

function Field({
  name,
  label,
  hint,
  error,
  required = true,
  children,
}: {
  name: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string; name: string; required: boolean }) => ReactNode
}) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {required ? null : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {children({ id, name, required, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const submitLabel: Record<EnquiryKind, string> = {
  contact: 'Send message',
}

export function EnquiryForm({ kind }: { kind: EnquiryKind }) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(submitEnquiry, null)
  const [startedAt, setStartedAt] = useState('')
  const summaryRef = useRef<HTMLDivElement>(null)
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {}

  useEffect(() => {
    // Browser-only value: read after mount so server and client render the same markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartedAt(String(Date.now()))
  }, [])

  // Move focus to the result so screen reader and keyboard users hear what happened.
  useEffect(() => {
    if (state) summaryRef.current?.focus()
  }, [state])

  // Submits through onSubmit (not the action prop) so the browser keeps what the visitor typed
  // when the server returns validation errors.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    startTransition(() => dispatch(data))
  }

  if (state?.ok) {
    return (
      <div ref={summaryRef} tabIndex={-1} role="status" className="rounded-xl border border-accent-ink/40 bg-accent/10 p-6">
        <p className="flex items-center gap-2 text-lg font-bold text-brand">
          <Icon name="check" className="size-6 text-accent-ink" />
          Thank you, we&apos;ve received your message.
        </p>
        <p className="mt-2 text-ink">Our team will get back to you within working hours, Monday to Saturday.</p>
        {state.dryRun ? (
          <p className="mt-3 text-sm text-muted">Test mode: email sending is not switched on yet, so this message was not delivered.</p>
        ) : null}
      </div>
    )
  }

  const errorList = Object.entries(errors)

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby={state ? 'form-status' : undefined}>
      <div id="form-status" ref={summaryRef} tabIndex={-1} className="focus:outline-none">
        {state && !state.ok ? (
          <div role="alert" className="rounded-md border border-red-700/40 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">{state.message}</p>
            {errorList.length ? (
              <ul className="mt-2 list-disc pl-5">
                {errorList.map(([field, msg]) => (
                  <li key={field}>{msg}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" error={errors.name}>
          {(p) => <input {...p} type="text" autoComplete="name" className={inputClass} />}
        </Field>
        <Field name="phone" label="Phone number" error={errors.phone}>
          {(p) => <input {...p} type="tel" autoComplete="tel" inputMode="tel" placeholder="0712 345 678" className={inputClass} />}
        </Field>
        <Field name="email" label="Email address" error={errors.email}>
          {(p) => <input {...p} type="email" autoComplete="email" className={inputClass} />}
        </Field>
        {kind === 'contact' ? (
          <Field name="subject" label="What is it about?" error={errors.subject}>
            {(p) => (
              <select {...p} defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Choose one
                </option>
                {contactSubjects.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            )}
          </Field>
        ) : null}
      </div>

      <Field name="message" label="Message" required error={errors.message}>
        {(p) => <textarea {...p} rows={5} maxLength={2000} className={cx(inputClass, 'min-h-32')} />}
      </Field>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={`${kind}-consent`}
            name="consent"
            type="checkbox"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${kind}-consent-error` : undefined}
            className="mt-0.5 size-5 shrink-0 accent-brand"
          />
          <label htmlFor={`${kind}-consent`} className="text-sm text-ink">
            I agree to my details being used to reply to this message, as described in the{' '}
            <Link href="/privacy" className="font-medium text-brand underline underline-offset-2">
              privacy policy
            </Link>
            .
          </label>
        </div>
        {errors.consent ? (
          <p id={`${kind}-consent-error`} className="mt-1.5 text-sm font-medium text-red-700">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={pending} className={buttonStyles('primary', 'w-full sm:w-auto disabled:opacity-60')}>
        {pending ? 'Sending…' : submitLabel[kind]}
      </button>
    </form>
  )
}
