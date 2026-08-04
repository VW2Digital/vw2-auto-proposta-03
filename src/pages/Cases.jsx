import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { Markdown } from '../components/Markdown'
import { cases as fallbackCases } from '../data/cases'
import { cms } from '../lib/cms'

export default function CasesPage() {
  const [cases, setCases] = useState(fallbackCases)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    cms.getCases().then((remote) => {
      if (active) {
        if (remote?.length) setCases(remote)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
              Cases de sucesso
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Resultados que falam por si
            </h1>
            <p className="mt-4 text-muted">
              Marcas que confiaram na Nexo e aceleraram o crescimento com estratégia digital.
            </p>
          </div>

          {loading && (
            <p className="mt-10 text-center text-sm text-muted">Carregando cases...</p>
          )}

          <div className="mt-14 space-y-8">
            {cases.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
                className="card-soft overflow-hidden rounded-[2rem]"
              >
                <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                  <div className="border-b border-line bg-surface p-6 lg:border-r lg:border-b-0 lg:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{item.client}</p>
                        <p className="text-xs text-muted">{item.sector}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                        {item.client.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="font-serif text-5xl font-medium text-ink italic">
                        {item.result}
                      </p>
                      <p className="mt-1 text-sm font-medium text-muted">{item.resultLabel}</p>
                    </div>

                    {item.metrics?.length > 0 && (
                      <div className="mt-8 grid grid-cols-3 gap-2 border-t border-line pt-5">
                        {item.metrics.map((m) => (
                          <div key={m.label} className="text-center">
                            <p className="text-sm font-bold text-ink">{m.value}</p>
                            <p className="text-[10px] tracking-wide text-muted uppercase">
                              {m.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-base leading-relaxed text-muted">{item.description}</p>
                    {item.body ? (
                      <div className="mt-6 border-t border-line pt-6">
                        <Markdown content={item.body} className="text-muted" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/#proposta"
              className="btn-h inline-flex items-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
            >
              Quero resultados assim
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
