import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { cases as fallbackCases } from '../data/cases'
import { cms } from '../lib/cms'

const AUTO_MS = 4500
const GAP = 20

function CaseCard({ item }) {
  const initials = item.client
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <article className="grid h-full min-h-[22rem] overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_12px_40px_-16px_rgba(15,15,15,0.12)] sm:min-h-[26rem] md:min-h-[28rem] md:grid-cols-[minmax(10rem,24%)_1fr]">
      <div className="flex flex-col justify-between p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{item.client}</p>
            <p className="mt-0.5 text-xs text-muted">{item.sector}</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-bold tracking-wide text-white">
            {initials}
          </div>
        </div>

        <div className="py-6 sm:py-8">
          <p className="font-serif text-4xl font-medium italic leading-none text-ink sm:text-5xl">
            {item.result}
          </p>
          <p className="mt-2 text-sm font-medium text-muted">{item.resultLabel}</p>
        </div>

        {item.metrics?.length > 0 ? (
          <div className="space-y-2.5 border-t border-line pt-4">
            {item.metrics.map((m) => (
              <div key={m.label} className="min-w-0">
                <p className="text-sm font-bold text-ink">{m.value}</p>
                <p className="mt-0.5 text-[10px] leading-tight tracking-wide text-muted uppercase">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative min-h-[12rem] bg-black/5 md:min-h-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.client}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-sm text-muted">
            Sem imagem
          </div>
        )}
      </div>
    </article>
  )
}

export default function Cases() {
  const [cases, setCases] = useState(fallbackCases)
  const n = cases.length
  const slides = useMemo(
    () => (n ? [...cases, ...cases, ...cases] : []),
    [cases, n],
  )
  const [index, setIndex] = useState(n || 0)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const reduceMotion = useReducedMotion()
  const step = slideWidth + GAP

  useEffect(() => {
    let alive = true
    cms.getCases().then((remote) => {
      if (alive && remote?.length) setCases(remote)
    })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (n > 0) {
      setAnimate(false)
      setIndex(n)
      requestAnimationFrame(() => setAnimate(true))
    }
  }, [n])

  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.querySelector('[data-case-slide]')
      if (first) setSlideWidth(first.getBoundingClientRect().width)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [slides.length])

  useEffect(() => {
    if (n <= 1 || paused || reduceMotion) return undefined
    const id = window.setInterval(() => {
      setAnimate(true)
      setIndex((i) => i + 1)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [n, paused, reduceMotion])

  const realIndex = n ? ((index % n) + n) % n : 0
  const offset = slideWidth > 0 ? index * step : 0
  const framePad = slideWidth > 0 ? `max(1rem, calc((100% - ${slideWidth}px) / 2))` : '1rem'

  const jumpToEquivalent = () => {
    if (n <= 1) return
    if (index >= n * 2) {
      setAnimate(false)
      setIndex(index - n)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true))
      })
    } else if (index < n) {
      setAnimate(false)
      setIndex(index + n)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true))
      })
    }
  }

  const goTo = (targetReal) => {
    if (!n) return
    setAnimate(true)
    setIndex(n + targetReal)
  }

  return (
    <section id="cases" className="scroll-mt-20 overflow-hidden bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Cases de sucesso
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Resultados que falam por si
          </h2>
          <p className="mt-4 text-muted">
            Marcas que confiaram na Nexo e aceleraram o crescimento com estratégia digital.
          </p>
          <Link
            to="/cases"
            className="mt-5 inline-block text-sm font-semibold text-ink underline underline-offset-4 decoration-ink/30 transition hover:decoration-ink"
          >
            Ver todos os cases
          </Link>
        </div>
      </div>

      <div
        className="relative mt-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
        }}
      >
        <div
          className="overflow-hidden"
          style={{ paddingLeft: framePad, paddingRight: framePad }}
        >
          <motion.div
            ref={trackRef}
            className="flex"
            style={{ gap: GAP }}
            animate={{ x: -offset }}
            transition={
              !animate || reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 120, damping: 22 }
            }
            onAnimationComplete={jumpToEquivalent}
          >
            {slides.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                data-case-slide
                className="w-[min(92vw,52rem)] shrink-0 sm:w-[min(88vw,56rem)]"
                aria-hidden={i % n !== realIndex}
              >
                <CaseCard item={item} />
              </div>
            ))}
          </motion.div>
        </div>

        {n > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {cases.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ir para case ${item.client}`}
                aria-current={i === realIndex}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === realIndex ? 'w-7 bg-ink' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
