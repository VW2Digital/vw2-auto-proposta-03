import { ArrowUpRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 bg-ink" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(109,140,255,0.55), transparent 45%), radial-gradient(ellipse at 20% 80%, rgba(232,121,249,0.4), transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Pronto para impulsionar{' '}
          <span className="font-serif font-medium italic">seus resultados</span>?
        </h2>
        <p className="mt-4 text-white/65">
          Monte sua proposta agora e receba um plano sob medida para o crescimento da sua marca.
        </p>
        <a
          href="#proposta"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#proposta')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="btn-h mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-ink transition hover:scale-[1.03]"
        >
          Vamos conversar
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  )
}
