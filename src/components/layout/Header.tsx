'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { cx } from '../ui'

type Facet = { slug: string; name: string }

export type MenuCategory = {
  slug: string
  name: string
  image: string
  needs: Facet[]
  types: Facet[]
  families: Array<{ slug: string; name: string; focus?: string; accent: string }>
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

/** Official Bioxcin logo (brand asset). On dark backgrounds it sits on a white chip. */
export function Logo({ onDark, className }: { onDark?: boolean; className?: string }) {
  return (
    <span className={cx('flex items-center', onDark && 'rounded-md bg-white px-3 py-2', className)}>
      <Image src="/images/logo.svg" alt="Bioxcin Kenya home" width={293} height={86} priority className="h-9 w-auto sm:h-11" />
    </span>
  )
}

const accentDot: Record<string, string> = {
  forte: 'bg-forte',
  collagen: 'bg-collagen',
  keratin: 'bg-keratin',
  hydra: 'bg-hydra',
  brand: 'bg-brand',
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
    <div ref={navRef} className="relative bg-white shadow-[0_2px_12px_rgba(0,59,115,0.08)]">
      <div ref={bar} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Logo />
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
          className="absolute inset-x-0 top-full z-40 border-t border-line bg-white shadow-xl"
        >
          <div className="mx-auto max-w-7xl px-8 py-7">
            {d.category ? (
              <div className="grid grid-cols-12 gap-8">
                <MenuColumn title="Needs" className="col-span-3">
                  {d.category.needs.map((n) => (
                    <MenuLink key={n.slug} href={`/${d.category!.slug}?need=${n.slug}`}>
                      {n.name}
                    </MenuLink>
                  ))}
                </MenuColumn>
                <MenuColumn title="Product types" className="col-span-2">
                  {d.category.types.map((t) => (
                    <MenuLink key={t.slug} href={`/${d.category!.slug}?type=${t.slug}`}>
                      {t.name}
                    </MenuLink>
                  ))}
                </MenuColumn>
                <MenuColumn title="Product families" className="col-span-4" columns>
                  {d.category.families.map((f) => (
                    <MenuLink key={f.slug} href={`/${d.category!.slug}/${f.slug}`}>
                      <span className={cx('mr-2 inline-block size-2 rounded-full', accentDot[f.accent] ?? 'bg-brand')} aria-hidden="true" />
                      {f.name}
                    </MenuLink>
                  ))}
                </MenuColumn>
                <Link href={d.href} className="group col-span-3 overflow-hidden rounded-xl bg-surface">
                  <span className="relative block aspect-[4/3]">
                    <Image src={d.category.image} alt="" fill sizes="20vw" className="object-cover transition-transform group-hover:scale-105" />
                  </span>
                  <span className="flex items-center justify-between gap-2 p-4 font-semibold text-brand">
                    View all {d.category.name.toLowerCase()}
                    <Icon name="arrowRight" className="size-4" />
                  </span>
                </Link>
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
                    <li className="min-[420px]:col-span-2 px-3 pt-2 text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">Product families</li>
                    {c.families.map((f) => (
                      <li key={f.slug}>
                        <Link href={`/${c.slug}/${f.slug}`} className="flex items-center rounded-md px-3 py-2.5 text-sm text-ink hover:bg-surface">
                          <span className={cx('mr-2 inline-block size-2 rounded-full', accentDot[f.accent] ?? 'bg-brand')} aria-hidden="true" />
                          {f.name}
                        </Link>
                      </li>
                    ))}
                    <li className="min-[420px]:col-span-2 px-3 pt-3 text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">Needs</li>
                    {c.needs.map((n) => (
                      <li key={n.slug}>
                        <Link href={`/${c.slug}?need=${n.slug}`} className="block rounded-md px-3 py-2.5 text-sm text-ink hover:bg-surface">
                          {n.name}
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

function MenuColumn({ title, className, columns, children }: { title: string; className?: string; columns?: boolean; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="mb-2 border-b border-line pb-2 text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">{title}</p>
      <ul className={cx(columns && 'grid grid-cols-2 gap-x-4')}>{children}</ul>
    </div>
  )
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex items-center rounded-md px-2 py-1.5 text-sm text-ink hover:bg-surface hover:text-brand">
        {children}
      </Link>
    </li>
  )
}
