import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Footer from '../components/Footer'
import PageBlocks from '../components/PageBlocks'
import { cms } from '../lib/cms'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [related, setRelated] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | missing

  useEffect(() => {
    let active = true
    setStatus('loading')
    ;(async () => {
      const [detail, list] = await Promise.all([
        cms.getProject(slug),
        cms.getProjects({ all: true }),
      ])
      if (!active) return
      if (!detail) {
        setStatus('missing')
        return
      }
      setProject(detail)
      setRelated((list || []).filter((p) => p.slug !== detail.slug).slice(0, 3))
      setStatus('ready')
    })()
    return () => {
      active = false
    }
  }, [slug])

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/projetos"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Todos os projetos
          </Link>

          {status === 'loading' && (
            <p className="mt-16 text-sm text-white/40">Carregando projeto...</p>
          )}

          {status === 'missing' && (
            <div className="mt-16 max-w-lg">
              <h1 className="text-3xl font-bold">Projeto não encontrado</h1>
              <p className="mt-3 text-white/50">
                Esse projeto pode ter sido removido ou o link está incorreto.
              </p>
              <Link
                to="/projetos"
                className="btn-h mt-8 inline-flex items-center rounded-full bg-white px-6 text-sm font-semibold text-ink"
              >
                Ver portfólio
              </Link>
            </div>
          )}

          {status === 'ready' && project && (
            <>
              <motion.header
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mt-10 max-w-3xl"
              >
                <p className="text-[11px] font-semibold tracking-wider text-white/45 uppercase">
                  {project.category}
                  {project.year ? ` · ${project.year}` : ''}
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {project.name}
                </h1>
                {project.client && (
                  <p className="mt-3 text-sm text-white/45">Cliente: {project.client}</p>
                )}
                {project.description && (
                  <p className="mt-6 text-lg leading-relaxed text-white/65">
                    {project.description}
                  </p>
                )}
              </motion.header>

              {project.image && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="mt-12 overflow-hidden rounded-[1.5rem] bg-white/5"
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
                  />
                </motion.div>
              )}

              {project.blocks?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                  className="mt-14"
                >
                  <PageBlocks
                    blocks={project.blocks}
                    variant="dark"
                    apiUrl={cms.apiUrl}
                  />
                </motion.div>
              )}

              {project.gallery?.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-sm font-semibold tracking-wider text-white/45 uppercase">
                    Galeria
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.gallery.map((shot, index) => (
                      <motion.figure
                        key={`${shot.image}-${index}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                        className={shot.wide ? 'sm:col-span-2' : ''}
                      >
                        <div className="overflow-hidden rounded-2xl bg-white/5">
                          <img
                            src={shot.image}
                            alt={shot.caption || project.name}
                            loading="lazy"
                            className={`w-full object-cover ${
                              shot.wide ? 'aspect-[21/9]' : 'aspect-[4/3]'
                            }`}
                          />
                        </div>
                        {shot.caption && (
                          <figcaption className="mt-2 text-sm text-white/40">
                            {shot.caption}
                          </figcaption>
                        )}
                      </motion.figure>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-white/45">Gostou deste trabalho?</p>
                  <p className="mt-1 text-lg font-semibold">Vamos construir o seu.</p>
                </div>
                <Link
                  to="/#proposta"
                  className="btn-h inline-flex items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink"
                >
                  Solicitar proposta
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {related.length > 0 && (
                <section className="mt-20">
                  <h2 className="text-2xl font-semibold">Mais projetos</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-3">
                    {related.map((item) => (
                      <Link key={item.id} to={`/projetos/${item.slug}`} className="group block">
                        <div className="overflow-hidden rounded-xl bg-white/5 aspect-[4/3]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                        <h3 className="mt-3 font-semibold">{item.name}</h3>
                        <p className="text-sm text-white/45">{item.category}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <div className="bg-white text-ink">
        <Footer />
      </div>
    </div>
  )
}
