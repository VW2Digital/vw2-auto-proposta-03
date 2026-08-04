import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cases as fallbackCases } from '../data/cases'
import { cms } from '../lib/cms'

export default function Cases() {
  const [cases, setCases] = useState(fallbackCases)

  useEffect(() => {
    let active = true
    cms.getCases().then((remote) => {
      if (active && remote?.length) setCases(remote)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="cases" className="scroll-mt-20 bg-white py-24 sm:py-28">
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

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="card-soft flex flex-col rounded-3xl p-6 transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{item.client}</p>
                  <p className="text-xs text-muted">{item.sector}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {item.client.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="mt-6">
                <p className="font-serif text-4xl font-medium text-ink italic">{item.result}</p>
                <p className="mt-1 text-sm font-medium text-muted">{item.resultLabel}</p>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
                {item.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="text-sm font-bold text-ink">{m.value}</p>
                    <p className="text-[10px] tracking-wide text-muted uppercase">{m.label}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
