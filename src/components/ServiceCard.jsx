import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ServiceCard({
  service,
  selected,
  onToggle,
  index = 0,
  variant = 'card',
}) {
  const Icon = service.icon

  if (variant === 'list') {
    return (
      <motion.li
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
        className="border-b border-line"
      >
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          className={`group flex w-full items-start gap-3.5 rounded-2xl px-3 py-5 text-left transition-colors duration-200 sm:gap-4 sm:px-4 sm:py-5 ${
            selected ? 'bg-ink text-white' : 'text-ink hover:bg-white/60'
          }`}
        >
          <span
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 ${
              selected ? 'bg-white text-ink' : 'bg-ink text-white'
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3
                className={`text-sm font-bold tracking-wide uppercase leading-snug ${
                  selected ? 'text-white' : 'text-ink'
                }`}
              >
                {service.title}
              </h3>
              {selected && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
            </div>
            <p className={`mt-1 text-sm leading-relaxed ${selected ? 'text-white/65' : 'text-muted'}`}>
              {service.description}
            </p>
            <span
              className={`mt-2.5 inline-block text-[11px] font-semibold tracking-wider uppercase ${
                selected ? 'text-white/70' : 'text-muted-light group-hover:text-ink'
              }`}
            >
              {selected ? 'Adicionado' : 'Clique para adicionar'}
            </span>
          </div>
        </button>
      </motion.li>
    )
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.35) }}
      onClick={onToggle}
      aria-pressed={selected}
      className={`group relative flex h-full w-full flex-col items-start rounded-3xl border p-6 text-left transition-all duration-300 ${
        selected
          ? 'border-ink bg-ink text-white shadow-xl shadow-black/15 -translate-y-1'
          : 'card-soft text-ink hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10'
      }`}
    >
      {selected && (
        <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink">
          <Check size={14} strokeWidth={3} />
        </span>
      )}

      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
          selected ? 'bg-white text-ink' : 'bg-ink text-white'
        }`}
      >
        <Icon size={20} strokeWidth={1.75} />
      </span>

      <h3
        className={`mt-5 text-sm font-bold tracking-wide uppercase leading-snug ${
          selected ? 'text-white' : 'text-ink'
        }`}
      >
        {service.title}
      </h3>

      <p className={`mt-2 text-sm leading-relaxed ${selected ? 'text-white/65' : 'text-muted'}`}>
        {service.description}
      </p>

      <span
        className={`mt-5 text-[11px] font-semibold tracking-wider uppercase ${
          selected ? 'text-white/70' : 'text-muted-light group-hover:text-ink'
        }`}
      >
        {selected ? 'Adicionado' : 'Clique para adicionar'}
      </span>
    </motion.button>
  )
}
