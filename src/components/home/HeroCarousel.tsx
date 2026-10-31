'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { cx } from '../ui'

export type HeroProduct = { src: string; alt: string; width: number; height: number }

export type Slide = {
  eyebrow: string
  title: string
  text: string
  href: string
  cta: string
  /** Gradient classes for the coloured text panel. */
  panel: string
  /** Background behind the products. */
  stage: string
  /** Colour of the CTA text, matching the panel. */
  ctaText: string
  /** Main product first; up to two more stand either side of it. */
  products: HeroProduct[]
  badge?: string
}

const INTERVAL = 7000

/**
 * Product hero slider: each slide pairs a coloured family panel with large packshots of the key
 * products. Auto-advances, pauses on hover and focus and has a visible pause button (WCAG 2.2.2),
 * does not auto-advance for people who prefer reduced motion, and works by keyboard.
 */
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaying(false)
    }
  }, [])

  useEffect(() => {
    if (!playing || hovered) return
    const t = window.setTimeout(() => go(index + 1), INTERVAL)
    return () => window.clearTimeout(t)
  }, [index, playing, hovered, go])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative overflow-hidden bg-brand"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className="grid">
        {slides.map((s, i) => {
          const [main, ...side] = s.products
          const active = i === index
          return (
            <div
              key={s.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!active}
              inert={!active}
              className={cx(
                'col-start-1 row-start-1 grid transition-opacity duration-700 motion-reduce:transition-none lg:grid-cols-12',
                active ? 'z-10 opacity-100' : 'opacity-0',
              )}
            >
              {/* Products */}
              <div className={cx('relative order-1 h-72 overflow-hidden sm:h-96 lg:order-2 lg:col-span-7 lg:h-[36rem]', s.stage)}>
                <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-2xl sm:size-[34rem]" />
                <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[9%] h-8 rounded-[100%] bg-black/15 blur-xl" />
                <div
                  className={cx(
                    'relative flex h-full items-end justify-center gap-0 px-6 pb-[10%] transition-transform duration-1000 motion-reduce:transition-none',
                    active ? 'translate-y-0' : 'translate-y-6',
                  )}
                >
                  {side[0] ? <Pack p={side[0]} className="-mr-4 h-[58%] sm:-mr-8" /> : null}
                  <Pack p={main} className="z-10 h-[80%]" priority={i === 0} />
                  {side[1] ? <Pack p={side[1]} className="-ml-4 h-[62%] sm:-ml-8" /> : null}
                </div>
                {s.badge ? (
                  <span className="absolute top-5 right-5 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wide text-ink uppercase shadow-md sm:top-8 sm:right-8 sm:text-sm">
                    {s.badge}
                  </span>
                ) : null}
              </div>

              {/* Text */}
              <div className={cx('relative order-2 flex items-center bg-gradient-to-br text-white lg:order-1 lg:col-span-5', s.panel)}>
                <div className="w-full px-4 pt-8 pb-24 sm:px-8 lg:py-16 lg:pr-10 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
                  <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-white/85 uppercase">{s.eyebrow}</p>
                  {i === 0 ? (
                    <h1 className="text-3xl leading-[1.08] text-white sm:text-5xl xl:text-6xl">{s.title}</h1>
                  ) : (
                    <h2 className="text-3xl leading-[1.08] text-white sm:text-5xl xl:text-6xl">{s.title}</h2>
                  )}
                  <p className="mt-4 max-w-md text-base text-white/90 sm:text-lg">{s.text}</p>
                  <Link
                    href={s.href}
                    className={cx(
                      'mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold tracking-wide uppercase shadow-lg transition-transform hover:-translate-y-0.5',
                      s.ctaText,
                    )}
                  >
                    {s.cta}
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls sit at the bottom of the text panel */}
      <div className="absolute bottom-5 left-0 z-20 w-full lg:w-5/12">
        <div className="flex items-center gap-3 px-4 text-white sm:px-8 lg:pr-10 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="flex size-11 items-center justify-center rounded-full border border-white/50 hover:bg-white/15"
          >
            <Icon name="chevronLeft" className="size-5" />
            <span className="sr-only">Previous slide</span>
          </button>
          <ul className="flex items-center">
            {slides.map((s, i) => (
              <li key={s.title}>
                <button type="button" onClick={() => go(i)} aria-current={i === index} className="flex size-8 items-center justify-center">
                  <span className={cx('block h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/55')} />
                  <span className="sr-only">
                    Show slide {i + 1}: {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="flex size-11 items-center justify-center rounded-full border border-white/50 hover:bg-white/15"
          >
            <Icon name="chevronRight" className="size-5" />
            <span className="sr-only">Next slide</span>
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="ml-auto flex size-11 items-center justify-center rounded-full border border-white/50 hover:bg-white/15"
          >
            <Icon name={playing ? 'pause' : 'play'} className="size-4" />
            <span className="sr-only">{playing ? 'Pause slideshow' : 'Play slideshow'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function Pack({ p, className, priority }: { p: HeroProduct; className?: string; priority?: boolean }) {
  return (
    <Image
      src={p.src}
      alt={p.alt}
      width={p.width}
      height={p.height}
      priority={priority}
      sizes="(min-width: 1024px) 25vw, 45vw"
      className={cx('w-auto max-w-[45%] object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.22)]', className)}
    />
  )
}
