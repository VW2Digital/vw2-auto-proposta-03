import { Link } from 'react-router-dom'
import { Mail, Phone, Share2, Globe } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Estratégia de design criativo para marcas que querem crescer com intenção e resultado.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Navegação</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link to="/#quem-ajudamos" className="hover:text-ink">Quem ajudamos</Link></li>
              <li><Link to="/projetos" className="hover:text-ink">Projetos</Link></li>
              <li><Link to="/#servicos" className="hover:text-ink">Serviços</Link></li>
              <li><Link to="/cases" className="hover:text-ink">Cases</Link></li>
              <li><Link to="/#proposta" className="hover:text-ink">Proposta</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Contato</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Mail size={14} />
                contato@nexostudio.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} />
                (11) 4000-0000
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Redes</p>
            <div className="mt-3 flex gap-2">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink" aria-label="Redes sociais">
                <Share2 size={16} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink" aria-label="Site">
                <Globe size={16} />
              </a>
            </div>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin`}
              className="mt-4 inline-block text-sm font-medium text-ink hover:underline"
            >
              Acessar CMS →
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Nexo Studio. Todos os direitos reservados.</p>
          <p className="font-serif italic">Estratégia de design criativo.</p>
        </div>
      </div>
    </footer>
  )
}
