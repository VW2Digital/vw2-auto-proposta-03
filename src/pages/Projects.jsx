import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { projects as fallbackProjects } from '../data/projects'
import { cms } from '../lib/cms'

export default function ProjectsPage() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    cms.getProjects({ all: true }).then((remote) => {
      if (active) {
        if (remote?.length) setProjects(remote)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <main className="pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-wider text-white/45 uppercase">
              Portfólio
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Projetos
            </h1>
            <p className="mt-4 text-base text-white/55">
              Seleção de trabalhos em marca, embalagem, digital e direção de arte.
            </p>
          </div>

          {loading && (
            <p className="mt-10 text-sm text-white/40">Carregando projetos...</p>
          )}

          <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.35) }}
                className="mb-5 break-inside-avoid"
              >
                <Link to={`/projetos/${project.slug || project.id}`} className="group block">
                  <div
                    className={`overflow-hidden rounded-xl bg-white/5 ${
                      project.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'
                    }`}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-white">{project.name}</h2>
                  <p className="mt-0.5 text-sm text-white/45">{project.category}</p>
                  {project.description && (
                    <p className="mt-2 text-sm leading-relaxed text-white/40">
                      {project.description}
                    </p>
                  )}
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/#proposta"
              className="btn-h inline-flex items-center rounded-full bg-white px-6 text-sm font-semibold text-ink"
            >
              Quero um projeto assim
            </Link>
          </div>
        </div>
      </main>
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  )
}
