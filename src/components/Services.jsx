import { useProposalStore } from '../store/proposalStore'
import { useServices } from '../hooks/useServices'
import ServiceCard from './ServiceCard'

export default function Services() {
  const services = useServices()
  const selectedServices = useProposalStore((s) => s.selectedServices)
  const toggleService = useProposalStore((s) => s.toggleService)

  return (
    <section id="servicos" className="relative scroll-mt-20 overflow-hidden bg-surface-2 py-24 sm:py-28">
      <div aria-hidden className="mesh-glow pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Nossos serviços
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Da ideia à execução, cuidamos de tudo
          </h2>
          <p className="mt-4 text-muted">
            Clique nos itens para montar sua proposta. Cada serviço entra automaticamente no resumo.
          </p>
        </div>

        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-1 border-t border-line md:grid-cols-2 md:gap-x-10">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              variant="list"
              selected={Boolean(selectedServices[service.id])}
              onToggle={() => toggleService(service.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
