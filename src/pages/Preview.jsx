import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react'
import { cms } from '../lib/cms'
import { Markdown } from '../components/Markdown'
import Logo from '../components/Logo'
import { cases as fallbackCases } from '../data/cases'
import { projects as fallbackProjects } from '../data/projects'
import { services as fallbackServices } from '../data/services'

const SECTIONS = [
  { id: 'cases', label: 'Cases' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'quem-ajudamos', label: 'Quem ajudamos' },
]

export default function Preview() {
  const [params] = useSearchParams()
  const section = params.get('section') || 'cases'
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState(fallbackCases)
  const [projects, setProjects] = useState(fallbackProjects)
  const [services, setServices] = useState(
    fallbackServices.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
    })),
  )
  const [audiences, setAudiences] = useState([])
  const [source, setSource] = useState('local')

  const load = async () => {
    setLoading(true)
    const [remoteCases, remoteProjects, remoteServices, remoteAudiences] = await Promise.all([
      cms.getCases(),
      cms.getProjects(),
      cms.getServices(),
      cms.getAudiences(),
    ])

    let fromCms = false
    if (remoteCases?.length) {
      setCases(remoteCases)
      fromCms = true
    }
    if (remoteProjects?.length) {
      setProjects(remoteProjects)
      fromCms = true
    }
    if (remoteServices?.length) {
      setServices(remoteServices)
      fromCms = true
    }
    if (remoteAudiences?.length) {
      setAudiences(remoteAudiences)
      fromCms = true
    }
    setSource(fromCms ? 'cms' : 'local')
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const el = document.getElementById(`preview-${section}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [section, loading])

  const siteUrl = useMemo(() => {
    if (section === 'cases') return '/#cases'
    if (section === 'projetos') return '/#projetos'
    if (section === 'servicos') return '/#servicos'
    if (section === 'quem-ajudamos') return '/#quem-ajudamos'
    return '/'
  }, [section])

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
              Preview
            </span>
            <span className="text-xs text-muted">
              Fonte: {source === 'cms' ? 'CMS (publicado)' : 'fallback local'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                to={`/preview?section=${s.id}`}
                className={`btn-h inline-flex items-center rounded-full px-3.5 text-xs font-semibold ${
                  section === s.id
                    ? 'bg-ink text-white'
                    : 'border border-line bg-white text-muted hover:text-ink'
                }`}
              >
                {s.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={load}
              className="btn-h inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 text-xs font-semibold text-ink"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </button>
            <Link
              to={siteUrl}
              className="btn-h inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 text-xs font-semibold text-white"
            >
              Ver no site
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft size={14} />
          Voltar ao site
        </Link>

        {loading && <p className="mb-6 text-sm text-muted">Carregando conteúdo publicado...</p>}

        <section id="preview-cases" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Cases publicados</h2>
          <p className="mt-1 text-sm text-muted">{cases.length} item(ns)</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cases.map((item) => (
              <article key={item.id} className="card-soft rounded-3xl p-5">
                <p className="font-semibold text-ink">{item.client}</p>
                <p className="text-xs text-muted">{item.sector}</p>
                <p className="mt-4 font-serif text-3xl italic text-ink">{item.result}</p>
                <p className="text-sm text-muted">{item.resultLabel}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                {item.body && (
                  <div className="mt-4 border-t border-line pt-4">
                    <Markdown content={item.body} className="text-muted" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="preview-projetos" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Projetos publicados</h2>
          <p className="mt-1 text-sm text-muted">{projects.length} item(ns)</p>
          <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {projects.map((project) => (
              <article key={project.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-black">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.name}
                    className={`w-full object-cover ${project.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-zinc-800 text-sm text-white/40">
                    Sem imagem
                  </div>
                )}
                <div className="p-4">
                  <p className="font-semibold text-white">{project.name}</p>
                  <p className="text-sm text-white/45">{project.category}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="preview-servicos" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Serviços publicados</h2>
          <p className="mt-1 text-sm text-muted">{services.length} item(ns)</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <article key={service.id} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-sm font-bold uppercase text-ink">{service.title}</p>
                <p className="mt-1 text-sm text-muted">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="preview-quem-ajudamos" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-ink">Quem ajudamos</h2>
          <p className="mt-1 text-sm text-muted">{audiences.length} item(ns)</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((item) => (
              <article key={item.id} className="card-soft rounded-3xl p-5">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
