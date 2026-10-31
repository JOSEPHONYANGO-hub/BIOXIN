'use client'

import { type ReactNode, useId, useRef, useState } from 'react'
import { cx } from '../ui'

export type Tab = { key: string; label: string; content: ReactNode }

/**
 * Tabs on wider screens, accordion on phones. Only one of the two layouts is ever displayed.
 * Tabs follow the WAI-ARIA pattern (arrow keys move between tabs).
 */
export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0)
  const [openMobile, setOpenMobile] = useState<number | null>(0)
  const id = useId()
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = tabs.length - 1
    const next = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1) : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <>
      {/* Tablet and desktop: tabs */}
      <div className="hidden sm:block">
        <div role="tablist" aria-label="Product details" className="flex gap-1 border-b border-line">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el
              }}
              role="tab"
              id={`${id}-tab-${t.key}`}
              aria-selected={i === active}
              aria-controls={`${id}-panel-${t.key}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cx(
                '-mb-px min-h-12 border-b-2 px-4 text-sm font-semibold transition-colors',
                i === active ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-brand',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tabs.map((t, i) => (
          <div key={t.key} role="tabpanel" id={`${id}-panel-${t.key}`} aria-labelledby={`${id}-tab-${t.key}`} hidden={i !== active} className="py-5">
            {t.content}
          </div>
        ))}
      </div>

      {/* Phones: accordion */}
      <div className="divide-y divide-line border-y border-line sm:hidden">
        {tabs.map((t, i) => {
          const open = openMobile === i
          return (
            <div key={t.key}>
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${id}-acc-${t.key}`}
                  onClick={() => setOpenMobile(open ? null : i)}
                  className="flex min-h-12 w-full items-center justify-between py-3 text-left text-base font-semibold text-brand"
                >
                  {t.label}
                  <span aria-hidden="true" className={cx('text-xl leading-none transition-transform', open && 'rotate-45')}>
                    +
                  </span>
                </button>
              </h3>
              <div id={`${id}-acc-${t.key}`} hidden={!open} className="pb-4">
                {t.content}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
