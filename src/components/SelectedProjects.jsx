import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects as fallbackProjects } from '../data/projects'
import { cms } from '../lib/cms'

export default function SelectedProjects() {
  const [projects, setProjects] = useState(fallbackProjects)

  useEffect(() => {
    let active = true
    cms.getProjects().then((remote) => {
      if (active && remote?.length) setProjects(remote)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="projetos" className="scroll-mt-20 bg-black py-20 sm:py-24">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Projetos Selecionados
          </h2>
          <Link
            to="/projetos"
            className="shrink-0 text-sm text-white underline underline-offset-4 decoration-white/50 transition hover:decoration-white"
          >
            Ver todos
          </Link>
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
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
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">{project.name}</h3>
                <p className="mt-0.5 text-sm text-white/45">{project.category}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
