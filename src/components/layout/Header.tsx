'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { cx } from '../ui'

export type MenuCategory = {
  slug: string
  name: string
  families: Array<{ slug: string; name: string; focus?: string }>
}

type Props = {
  categories: MenuCategory[]
  partners: Array<{ label: string; href: string; description?: string }>
}

const simpleLinks = [
  { label: 'Science', href: '/science' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Wordmark({ onDark }: { onDark?: boolean }) {
  // Text wordmark until the official Bioxcin logo files are supplied; it is not a redesigned logo.
  return (
    <span className="flex items-baseline gap-2 leading-none">
      <span className={cx('text-2xl font-extrabold tracking-[0.12em]', onDark ? 'text-white' : 'text-brand')}>BIOXCIN</span>
      <span className={cx('text-xs font-semibold tracking-[0.2em] uppercase', onDark ? 'text-accent-light' : 'text-accent-ink')}>
        Kenya
      </span>
    </span>
  )
}

export function Header({ categories, partners }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const mobileButton = useRef<HTMLButtonElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [panelTop, setPanelTop] = useState(64)
  const baseId = useId()

  // Close menus after navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(null)
    setMobileOpen(false)
  }, [pathname])

  // Escape closes whichever menu is open; clicking outside closes desktop dropdowns.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (mobileOpen) {
        setMobileOpen(false)
        mobileButton.current?.focus()
      } else if (open) {
        const trigger = document.getElementById(`${baseId}-${open}-button`)
        setOpen(null)
        trigger?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (open && navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open, mobileOpen, baseId])

  // Keep the page behind the mobile menu from scrolling.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const dropdowns = [
    ...categories.map((c) => ({ key: c.slug, label: c.name, href: `/${c.slug}`, category: c })),
    { key: 'partners', label: 'For business', href: '/partners/pharmacies', category: null },
  ]

  return (
    <div ref={navRef} className="relative border-b border-line bg-white">
      <div ref={bar} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {dropdowns.map((d) => {
              const expanded = open === d.key
              return (
                <li key={d.key}>
                  <button
                    id={`${baseId}-${d.key}-button`}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`${baseId}-${d.key}-panel`}
                    onClick={() => setOpen(expanded ? null : d.key)}
                    className={cx(
                      'flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-semibold transition-colors hover:bg-surface',
                      d.key === 'partners' ? 'text-accent-ink' : 'text-brand',
                      (expanded || (d.category && isActive(d.href))) && 'bg-surface',
                    )}
                  >
                    {d.label}
                    <Icon name="chevronDown" className={cx('size-4 transition-transform', expanded && 'rotate-180')} />
                  </button>
                </li>
              )
            })}
            {simpleLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={cx(
                    'flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-brand hover:bg-surface',
                    isActive(l.href) && 'bg-surface',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={mobileButton}
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-2 text-sm font-semibold text-brand lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls={`${baseId}-mobile`}
          onClick={() => {
            setPanelTop(bar.current?.getBoundingClientRect().bottom ?? 64)
            setMobileOpen((v) => !v)
          }}
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} className="size-6" />
          <span>{mobileOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Desktop mega menu panels */}
      <div className="hidden lg:block">
      {dropdowns.map((d) => (
        <div
          key={d.key}
          id={`${baseId}-${d.key}-panel`}
          hidden={open !== d.key}
          className="absolute inset-x-0 top-full z-40 border-b border-line bg-white shadow-xl"
        >
          <div className="mx-auto max-w-7xl px-8 py-8">
            {d.category ? (
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">{d.category.name}</p>
                  <Link href={d.href} className="mt-3 inline-flex items-center gap-1.5 text-lg font-bold text-brand hover:underline">
                    View all {d.category.name.toLowerCase()}
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                </div>
                <ul className="col-span-3 grid grid-cols-3 gap-x-8 gap-y-1">
                  {d.category.families.map((f) => (
                    <li key={f.slug}>
                      <Link href={`/${d.category!.slug}/${f.slug}`} className="block rounded-md px-3 py-2 hover:bg-surface">
                        <span className="block text-sm font-semibold text-brand">{f.name}</span>
                        {f.focus ? <span className="block text-xs text-muted">{f.focus}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">For business</p>
                  <p className="mt-3 text-sm text-muted">Partner with Bioxcin in Kenya.</p>
                </div>
                <ul className="col-span-3 grid grid-cols-2 gap-6">
                  {partners.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="block rounded-lg border border-line p-5 hover:border-brand hover:bg-surface">
                        <span className="block font-semibold text-brand">{p.label}</span>
                        {p.description ? <span className="mt-1 block text-sm text-muted">{p.description}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
      </div>

      {/* Mobile menu: fixed below the header bar, filling the rest of the screen. */}
      <div
        id={`${baseId}-mobile`}
        hidden={!mobileOpen}
        style={{ top: panelTop }}
        className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Main" className="px-4 pt-2 pb-10 sm:px-6">
          <ul className="divide-y divide-line">
            {categories.map((c) => (
              <li key={c.slug}>
                <details className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-base font-semibold text-brand [&::-webkit-details-marker]:hidden">
                    {c.name}
                    <Icon name="chevronDown" className="size-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="mb-3 grid grid-cols-1 gap-1 min-[420px]:grid-cols-2">
                    <li className="min-[420px]:col-span-2">
                      <Link href={`/${c.slug}`} className="block rounded-md bg-surface px-3 py-2.5 text-sm font-semibold text-brand">
                        View all {c.name.toLowerCase()}
                      </Link>
                    </li>
                    {c.families.map((f) => (
                      <li key={f.slug}>
                        <Link href={`/${c.slug}/${f.slug}`} className="block rounded-md px-3 py-2.5 text-sm text-ink hover:bg-surface">
                          {f.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            {simpleLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className="flex min-h-12 items-center py-3 text-base font-semibold text-brand"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-brand p-5 text-white">
            <p className="text-xs font-semibold tracking-[0.14em] text-accent-light uppercase">For business</p>
            <ul className="mt-3 space-y-2">
              {partners.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="flex min-h-11 items-center justify-between font-semibold">
                    {p.label}
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}
