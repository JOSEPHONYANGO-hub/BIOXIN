import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { Icon } from './Icon'

export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

type Tone = 'white' | 'surface' | 'brand'

const toneClass: Record<Tone, string> = {
  white: 'bg-white',
  surface: 'bg-surface',
  brand: 'bg-brand text-white [&_h2]:text-white [&_h3]:text-white',
}

export function Section({
  tone = 'white',
  className,
  children,
  ...rest
}: { tone?: Tone; className?: string; children: ReactNode } & ComponentProps<'section'>) {
  return (
    <section className={cx(toneClass[tone], 'py-14 sm:py-20', className)} {...rest}>
      <Container>{children}</Container>
    </section>
  )
}

export function Eyebrow({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p className={cx('mb-3 text-xs font-semibold tracking-[0.14em] uppercase', onDark ? 'text-accent-light' : 'text-accent-ink')}>
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  onDark,
}: {
  eyebrow?: string
  title: string
  intro?: ReactNode
  id?: string
  onDark?: boolean
}) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className="text-3xl sm:text-4xl">
        {title}
      </h2>
      {intro ? <p className={cx('mt-4 text-lg', onDark ? 'text-white/85' : 'text-muted')}>{intro}</p> : null}
    </div>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'onDark' | 'outlineOnDark' | 'ghost'

const buttonClass: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border-2 border-brand bg-white text-brand hover:bg-surface',
  onDark: 'bg-white text-brand hover:bg-surface',
  outlineOnDark: 'border-2 border-white text-white hover:bg-white/10',
  ghost: 'text-brand underline-offset-4 hover:underline px-0',
}

export const buttonStyles = (variant: ButtonVariant = 'primary', className?: string) =>
  cx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors',
    buttonClass[variant],
    className,
  )

export function ButtonLink({
  href,
  variant,
  className,
  children,
  external,
}: {
  href: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
  external?: boolean
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonStyles(variant, className)}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={href} className={buttonStyles(variant, className)}>
      {children}
    </Link>
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink', className)}>
      {children}
    </span>
  )
}

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Plain page header used by every inner page. */
export function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
  tone = 'surface',
}: {
  title: string
  intro?: ReactNode
  eyebrow?: string
  crumbs?: Crumb[]
  tone?: 'surface' | 'brand'
}) {
  const dark = tone === 'brand'
  return (
    <header className={cx(dark ? 'bg-brand text-white' : 'bg-surface', 'py-10 sm:py-14')}>
      <Container>
        {crumbs ? (
          <div className={dark ? '[&_a]:text-white/85 [&_nav]:text-white/85 [&_span]:text-white' : ''}>
            <Breadcrumbs items={crumbs} />
          </div>
        ) : null}
        {eyebrow ? <Eyebrow onDark={dark}>{eyebrow}</Eyebrow> : null}
        <h1 className={cx('max-w-3xl text-3xl sm:text-5xl', dark && 'text-white')}>{title}</h1>
        {intro ? <p className={cx('mt-4 max-w-2xl text-lg', dark ? 'text-white/85' : 'text-muted')}>{intro}</p> : null}
      </Container>
    </header>
  )
}

/**
 * Marks content that is waiting for approved copy, so development placeholders can never be
 * mistaken for real product or legal information.
 */
export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="flex gap-3 rounded-md border border-dashed border-keratin-ink/60 bg-keratin/10 p-4 text-sm text-ink">
      <span className="font-semibold text-keratin-ink">Content pending:</span>
      <span>{children}</span>
    </div>
  )
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 font-semibold text-brand hover:text-accent-ink">
      {children}
      <Icon name="arrowRight" className="size-4" />
    </Link>
  )
}
