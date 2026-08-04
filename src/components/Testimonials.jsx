import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { testimonials as fallbackTestimonials } from '../data/testimonials'
import { cms } from '../lib/cms'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)

  useEffect(() => {
    let active = true
    cms.getTestimonials().then((remote) => {
      if (active && remote?.length) setTestimonials(remote)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Depoimentos
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Quem cresce conosco recomenda
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="card-soft flex flex-col rounded-3xl p-6"
            >
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                “{item.quote}”
              </p>
              <footer className="mt-6 border-t border-line pt-4">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
