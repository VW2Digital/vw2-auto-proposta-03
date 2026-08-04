import { motion } from 'framer-motion'
import { howItWorks } from '../data/testimonials'

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Como funciona
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Sua proposta pronta em 4 passos
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-3xl border border-line bg-white p-6"
            >
              <span className="font-serif text-4xl text-ink/25 italic">{item.step}</span>
              <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
