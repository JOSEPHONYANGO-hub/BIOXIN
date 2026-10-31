'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { buttonStyles, cx } from '../ui'

export type Slide = {
  image: string
  /** Where to anchor the image when it is cropped: keeps the subject in view. */
  position?: string
  eyebrow: string
  title: string
  text: string
  href: string
  cta: string
}

const INTERVAL = 6500

/**
 * Full-width hero slider. Auto-advances, pauses on hover and focus and has a visible pause button
 * (WCAG 2.2.2), does not auto-advance for people who prefer reduced motion, and stays fully usable
 * by keyboard.
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
      aria-label="Featured ranges"
      className="relative overflow-hidden bg-brand text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className="relative h-[30rem] sm:h-[34rem] lg:h-[38rem]">
        {slides.map((s, i) => (
          <div
            key={s.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className={cx('absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none', i === index ? 'opacity-100' : 'opacity-0')}
          >
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: s.position ?? 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand from-15% via-brand/75 via-45% to-transparent max-md:bg-gradient-to-t max-md:from-brand max-md:via-brand/90 max-md:to-brand/50" />
            <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-24 sm:px-6 md:items-center md:pb-0 lg:px-8">
              <div className="max-w-xl">
                <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-accent-light uppercase">{s.eyebrow}</p>
                {i === 0 ? (
                  <h1 className="text-3xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">{s.title}</h1>
                ) : (
                  <h2 className="text-3xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">{s.title}</h2>
                )}
                <p className="mt-4 max-w-lg text-base text-white/90 sm:text-lg">{s.text}</p>
                <Link href={s.href} className={buttonStyles('onDark', 'mt-7')}>
                  {s.cta}
                  <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-5">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="flex size-11 items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
          >
            <Icon name="chevronLeft" className="size-5" />
            <span className="sr-only">Previous slide</span>
          </button>
          <ul className="flex items-center gap-1">
            {slides.map((s, i) => (
              <li key={s.title}>
                <button type="button" onClick={() => go(i)} aria-current={i === index} className="flex size-8 items-center justify-center">
                  <span className={cx('block h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50')} />
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
            className="flex size-11 items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
          >
            <Icon name="chevronRight" className="size-5" />
            <span className="sr-only">Next slide</span>
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="ml-auto flex size-11 items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
          >
            <Icon name={playing ? 'pause' : 'play'} className="size-4" />
            <span className="sr-only">{playing ? 'Pause slideshow' : 'Play slideshow'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
