import { motion } from 'framer-motion'
import { cms } from '../lib/cms'
import { Markdown } from './Markdown'
import { useCmsContent } from '../hooks/useCmsContent'

const fallback = {
  tags: ['Design Inteligente', 'Experiências', 'Estratégia', 'Marca'],
  title:
    '<span style="color:#ffffff">*Design criativo*</span>\n\n<span style="color:#ffffff">**ESTRATÉGIA**</span>',
  subtitle:
    'Monte sua proposta personalizada em minutos e impulsione o crescimento do seu negócio.',
  ctaLabel: 'Vamos conversar',
  ctaLink: '#proposta',
  image: '/hero-team.png?v=3',
  height: 85,
  objectPosition: 'center',
}

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function isExternalLink(href) {
  return /^(https?:|mailto:|tel:|wa\.me)/i.test(href || '')
}

async function fetchHero() {
  const remote = await cms.getHero()
  if (!remote?.title) return null
  return {
    tags: remote.tags?.length ? remote.tags : fallback.tags,
    title: remote.title || fallback.title,
    subtitle: remote.subtitle || fallback.subtitle,
    ctaLabel: remote.ctaLabel || fallback.ctaLabel,
    ctaLink: remote.ctaLink || fallback.ctaLink,
    image: remote.image || fallback.image,
    height: remote.height || fallback.height,
    objectPosition: remote.objectPosition || fallback.objectPosition,
  }
}

export default function Hero() {
  const { content } = useCmsContent('nexo:hero', fetchHero, {
    fallback,
    isValid: (data) => Boolean(data?.title),
  })

  const heightVh = Math.min(100, Math.max(50, content?.height || fallback.height))
  const ctaHref = content?.ctaLink || fallback.ctaLink

  const goCta = (e) => {
    if (!ctaHref.startsWith('#')) return
    e.preventDefault()
    document.querySelector(ctaHref)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative overflow-hidden bg-black pt-28 pb-10 sm:pt-32 sm:pb-14"
      style={{ minHeight: `${heightVh}svh` }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        aria-hidden
      >
        <img
          src={content?.image || fallback.image}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: content?.objectPosition || fallback.objectPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />
      </motion.div>

      <div
        className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-4 sm:px-6 lg:px-8"
        style={{ minHeight: `calc(${heightVh}svh - 8rem)` }}
      >
        {content ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="min-w-0 max-w-3xl">
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="hero-title mt-6">
                <Markdown content={content.title} className="hero-md" />
              </div>

              <p className="mt-5 max-w-md text-base text-white/70 sm:text-lg">
                {content.subtitle}
              </p>
            </div>

            <a
              href={ctaHref}
              onClick={goCta}
              target={isExternalLink(ctaHref) ? '_blank' : undefined}
              rel={isExternalLink(ctaHref) ? 'noreferrer' : undefined}
              className="inline-flex h-14 shrink-0 items-center gap-2.5 self-start rounded-full bg-[#25D366] px-8 text-base font-semibold text-black shadow-lg shadow-[#25D366]/25 transition hover:scale-[1.03] hover:bg-[#1ebe57] active:scale-[0.98] lg:self-end"
            >
              <WhatsAppIcon size={22} />
              {content.ctaLabel}
            </a>
          </motion.div>
        ) : (
          <div
            className="flex min-h-[12rem] flex-col justify-end gap-4 opacity-40"
            aria-hidden
          >
            <div className="h-8 w-64 max-w-full rounded-full bg-white/15" />
            <div className="h-16 w-full max-w-xl rounded-2xl bg-white/10" />
            <div className="h-16 w-3/4 max-w-lg rounded-2xl bg-white/10" />
          </div>
        )}
      </div>
    </section>
  )
}
