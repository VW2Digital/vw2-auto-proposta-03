import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import { cms } from '../lib/cms'

const navLinks = [
  { href: '#quem-ajudamos', label: 'Quem ajudamos', homeOnly: true },
  { to: '/projetos', label: 'Projetos' },
  { href: '#servicos', label: 'Serviços', homeOnly: true },
  { to: '/cases', label: 'Cases' },
  { href: '#proposta', label: 'Proposta', homeOnly: true },
  { href: '#como-funciona', label: 'Como funciona', homeOnly: true },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const isDark =
    location.pathname === '/' ||
    location.pathname === '/projetos' ||
    location.pathname.startsWith('/projetos/')

  const handleAnchor = (href) => {
    setOpen(false)
    if (!isHome) return
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-5 sm:px-6 lg:px-8">
        <Link
          to={isHome ? '/#proposta' : '/'}
          onClick={(e) => {
            if (isHome) {
              e.preventDefault()
              handleAnchor('#proposta')
            }
          }}
          className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-[#2a2a2a] py-1.5 pr-4 pl-1.5 shadow-sm backdrop-blur-md transition hover:bg-[#333] sm:inline-flex"
        >
          <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <img
              src="/avatar.png"
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#2a2a2a] bg-available" />
          </span>
          <span className="text-xs font-medium text-white">
            Agende 30 min <span className="text-white/40">•</span>{' '}
            <span className="text-available">Disponível agora</span>
          </span>
        </Link>

        <Logo
          className="absolute left-1/2 -translate-x-1/2"
          invert={isDark}
        />

        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`btn-h inline-flex items-center gap-2 rounded-full px-5 text-sm font-medium transition ${
              isDark
                ? 'border border-white/10 bg-[#2a2a2a] text-white hover:bg-[#333]'
                : 'bg-ink text-white hover:bg-ink-soft'
            }`}
          >
            {open ? 'Fechar' : 'Menu'}
            {open ? <X size={16} strokeWidth={2.25} /> : <Menu size={16} strokeWidth={2.25} />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.nav
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 rounded-3xl border border-line bg-white/95 p-2 shadow-xl backdrop-blur-md"
              >
                {navLinks.map((link) => {
                  if (link.to) {
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className="block rounded-2xl px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
                      >
                        {link.label}
                      </Link>
                    )
                  }
                  if (link.homeOnly && !isHome) {
                    return (
                      <Link
                        key={link.href}
                        to={`/${link.href}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-2xl px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
                      >
                        {link.label}
                      </Link>
                    )
                  }
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleAnchor(link.href)
                      }}
                      className="block rounded-2xl px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
                    >
                      {link.label}
                    </a>
                  )
                })}
                <a
                  href={cms.adminUrl}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
                >
                  Entrar
                </a>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
