'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useId, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { cx } from '../ui'

export type RoutineStep = { step: string; verb: string; name: string; href: string; image: string; alt: string }
export type Routine = { key: string; label: string; accent: string; steps: RoutineStep[] }

/** Three-step routine (cleanse, treat, nourish), with a tab for each hair concern. */
export function RoutineBuilder({ routines }: { routines: Routine[] }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const tabs = useRef<Array<HTMLButtonElement | null>>([])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = routines.length - 1
    const next = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1) : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Choose your hair concern" className="mb-8 flex flex-wrap gap-2">
        {routines.map((r, i) => (
          <button
            key={r.key}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            id={`${id}-tab-${r.key}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${r.key}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'min-h-11 rounded-full border-2 px-5 text-sm font-semibold transition-colors',
              i === active ? 'border-brand bg-brand text-white' : 'border-line bg-white text-brand hover:border-brand',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      {routines.map((r, i) => (
        <div key={r.key} role="tabpanel" id={`${id}-panel-${r.key}`} aria-labelledby={`${id}-tab-${r.key}`} hidden={i !== active}>
          <ol className="grid gap-4 md:grid-cols-3 md:gap-0">
            {r.steps.map((s, n) => (
              <li key={s.step} className="relative flex md:px-3">
                <Link
                  href={s.href}
                  className="group flex w-full items-center gap-4 rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-md md:flex-col md:items-stretch md:p-5"
                >
                  <span className="relative block size-24 shrink-0 md:aspect-square md:size-auto">
                    <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 25vw, 96px" className="object-contain" />
                  </span>
                  <span className="block">
                    <span className={cx('text-xs font-bold tracking-[0.14em] uppercase', r.accent)}>
                      Step {n + 1} · {s.step}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{s.verb}</span>
                    <span className="mt-1 block font-bold text-brand group-hover:underline">{s.name}</span>
                  </span>
                </Link>
                {n < r.steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -right-3 z-10 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-ink shadow md:flex"
                  >
                    <Icon name="arrowRight" className="size-4" />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
