import { useProposalStore } from '../store/proposalStore'
import { useServices } from '../hooks/useServices'
import ServiceCard from './ServiceCard'
import ProposalForm from './ProposalForm'
import { MessageSquareText, Trash2, X } from 'lucide-react'

export default function ProposalBuilder() {
  const services = useServices()
  const selectedServices = useProposalStore((s) => s.selectedServices)
  const toggleService = useProposalStore((s) => s.toggleService)
  const setServiceNotes = useProposalStore((s) => s.setServiceNotes)
  const clearSelection = useProposalStore((s) => s.clearSelection)

  const selectedList = services.filter((s) => selectedServices[s.id])
  const count = selectedList.length

  return (
    <section id="proposta" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Monte sua proposta
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Monte sua proposta{' '}
            <span className="font-serif font-medium italic">personalizada</span>
          </h2>
          <p className="mt-4 text-muted">
            Selecione os serviços, adicione observações e envie. Formalizamos e retornamos com a proposta completa.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-ink">Selecione os serviços</h3>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    Limpar
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    selected={Boolean(selectedServices[service.id])}
                    onToggle={() => toggleService(service.id)}
                  />
                ))}
              </div>
            </div>

            {count > 0 && (
              <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MessageSquareText size={18} className="text-ink" />
                  <h3 className="text-base font-semibold text-ink">Observações por serviço</h3>
                </div>
                <div className="space-y-4">
                  {selectedList.map((service) => (
                    <div key={service.id}>
                      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-muted uppercase">
                        {service.title}
                      </label>
                      <textarea
                        rows={2}
                        value={selectedServices[service.id]?.notes || ''}
                        onChange={(e) => setServiceNotes(service.id, e.target.value)}
                        placeholder="Detalhes, objetivos ou prioridades..."
                        className="w-full resize-none rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ProposalForm />
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink">Resumo</h3>
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2 text-xs font-bold text-white">
                  {count}
                </span>
              </div>

              {count === 0 ? (
                <p className="mt-4 text-sm text-muted">
                  Nenhum serviço selecionado. Clique nos cards para começar.
                </p>
              ) : (
                <ul className="mt-4 max-h-[420px] space-y-2 overflow-y-auto scrollbar-thin pr-1">
                  {selectedList.map((service) => (
                    <li
                      key={service.id}
                      className="flex items-start justify-between gap-2 rounded-2xl border border-line bg-white px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-snug text-ink uppercase">
                          {service.title}
                        </p>
                        {selectedServices[service.id]?.notes && (
                          <p className="mt-1 truncate text-xs text-muted">
                            {selectedServices[service.id].notes}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className="mt-0.5 shrink-0 rounded-full p-1 text-muted transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remover ${service.title}`}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                disabled={count === 0}
                onClick={() =>
                  document
                    .querySelector('#proposal-form')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className={`btn-h mt-5 inline-flex w-full items-center justify-center rounded-full text-sm font-semibold transition ${
                  count > 0
                    ? 'bg-ink text-white hover:bg-ink-soft'
                    : 'cursor-not-allowed bg-line text-muted-light'
                }`}
              >
                {count > 0 ? 'Finalizar e solicitar' : 'Selecione serviços'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
