import { useEffect, useState } from 'react'
import { cms } from '../lib/cms'

const fallback = {
  line1Prefix: 'Junte-se a',
  line1Stat: '5.000+',
  line1Suffix: 'membros satisfeitos.',
  line2Prefix: 'Confiado por',
  line2Stat: '5.000+',
  line2Suffix: 'times.',
  logos: ['Kerala', 'Dean Tadnai', 'Root Media', 'Altitude', 'Northline'],
}

export default function TrustBar() {
  const [content, setContent] = useState(fallback)

  useEffect(() => {
    let active = true
    cms.getTrustBar().then((remote) => {
      if (active && remote?.line1Stat) setContent({ ...fallback, ...remote })
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p className="max-w-xs text-sm leading-relaxed text-muted">
          {content.line1Prefix}{' '}
          <span className="font-semibold text-ink">{content.line1Stat}</span>{' '}
          {content.line1Suffix}
          <br />
          {content.line2Prefix}{' '}
          <span className="font-semibold text-ink">{content.line2Stat}</span>{' '}
          {content.line2Suffix}
        </p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:gap-x-10">
          {content.logos.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold tracking-tight text-ink/35 select-none sm:text-base"
              style={{
                fontFamily: name.length > 8 ? 'Georgia, serif' : 'Inter, sans-serif',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
