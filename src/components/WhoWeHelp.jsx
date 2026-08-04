import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Briefcase, GraduationCap, HeartPulse } from 'lucide-react'
import { cms } from '../lib/cms'
import { resolveIcon } from '../lib/icons'

const fallbackAudiences = [
  {
    icon: Rocket,
    title: 'Startups SaaS',
    description:
      'Aceleramos aquisição e retenção com funis digitais, posicionamento e ciclos de crescimento mensuráveis.',
  },
  {
    icon: Briefcase,
    title: 'Agências Digitais',
    description:
      'Parceiro estratégico para escalar entrega, identidade de marca e performance sem perder qualidade criativa.',
  },
  {
    icon: GraduationCap,
    title: 'Coaches e Consultores',
    description:
      'Presença digital que comunica autoridade e converte audiência em clientes de alto valor.',
  },
  {
    icon: HeartPulse,
    title: 'Saúde e Bem-estar',
    description:
      'Marcas de saúde e bem-estar com conteúdo, mídia local e jornadas de atendimento humanizadas.',
  },
]

export default function WhoWeHelp() {
  const [audiences, setAudiences] = useState(fallbackAudiences)

  useEffect(() => {
    let active = true
    cms.getAudiences().then((remote) => {
      if (active && remote?.length) {
        setAudiences(
          remote.map((a) => ({
            ...a,
            icon: resolveIcon(a.icon, Rocket),
          })),
        )
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="quem-ajudamos" className="relative scroll-mt-20 overflow-hidden bg-white py-24 sm:py-28">
      <div aria-hidden className="mesh-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Quem ajudamos
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Impulsionamos ideias ousadas nesses setores.
          </h2>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(147,197,253,0.55), rgba(196,181,253,0.35), transparent 70%)',
            }}
          />

          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.article
                  key={item.id || item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="card-soft rounded-3xl p-6"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
