import { cms } from '../lib/cms'
import { Markdown } from './Markdown'
import { useCmsContent } from '../hooks/useCmsContent'

const fallback = {
  text: 'Junte-se a **5.000+** membros satisfeitos.\nConfiado por **5.000+** times.',
  logos: [
    { name: 'Kerala', image: '' },
    { name: 'Dean Tadnai', image: '' },
    { name: 'Root Media', image: '' },
    { name: 'Altitude', image: '' },
    { name: 'Northline', image: '' },
  ],
}

async function fetchTrustBar() {
  const remote = await cms.getTrustBar()
  if (!remote?.text) return null
  return {
    text: remote.text,
    logos: remote.logos?.length ? remote.logos : fallback.logos,
  }
}

function LogoItem({ logo }) {
  if (logo.image) {
    return (
      <img
        src={logo.image}
        alt={logo.name}
        className="h-[32px] w-auto max-w-[7rem] shrink-0 object-contain opacity-50 grayscale sm:h-[40px]"
      />
    )
  }

  return (
    <span
      className="shrink-0 text-sm font-semibold tracking-tight text-ink/35 select-none sm:text-base"
      style={{
        fontFamily: logo.name.length > 8 ? 'Georgia, serif' : 'Inter, sans-serif',
      }}
    >
      {logo.name}
    </span>
  )
}

export default function TrustBar() {
  const { content } = useCmsContent('nexo:trust-bar', fetchTrustBar, {
    fallback,
    isValid: (data) => Boolean(data?.text),
  })

  if (!content) {
    return (
      <section className="border-y border-line bg-surface">
        <div className="mx-auto h-[7.5rem] max-w-7xl px-4 sm:h-[8.5rem] sm:px-6 lg:px-8" />
      </section>
    )
  }

  const logos = content.logos
  const loop = [...logos, ...logos]

  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 sm:py-14 lg:px-8">
        <Markdown
          content={content.text}
          className="max-w-xs shrink-0 !space-y-0 text-muted [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-ink"
        />

        <div className="trust-marquee min-w-0 w-full flex-1 sm:max-w-xl lg:max-w-2xl">
          <div className="trust-marquee-track">
            {loop.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center px-4 sm:px-5"
                aria-hidden={i >= logos.length ? true : undefined}
              >
                <LogoItem logo={logo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
