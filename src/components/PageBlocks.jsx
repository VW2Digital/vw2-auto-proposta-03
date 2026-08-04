import { Markdown } from './Markdown'

function mediaUrl(media, apiUrl = '') {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (media.url?.startsWith('http')) return media.url
  if (media.url) return `${apiUrl}${media.url}`
  return ''
}

function isExternal(href) {
  return /^(https?:|mailto:|tel:|wa\.me)/i.test(href || '')
}

function toEmbedUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (u.pathname.startsWith('/embed/')) return `${u.origin}${u.pathname}`
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }
  } catch {
    return ''
  }
  return ''
}

/**
 * @param {{ blocks: array, variant?: 'light' | 'dark', apiUrl?: string, proseMax?: string }} props
 */
export default function PageBlocks({
  blocks = [],
  variant = 'light',
  apiUrl = '',
  proseMax = 'max-w-2xl',
}) {
  if (!blocks?.length) return null

  const onDark = variant === 'dark'

  return (
    <div className="flex flex-col gap-10">
      {blocks.map((block, index) => (
        <Block
          key={block.id || `${block.blockType}-${index}`}
          block={block}
          onDark={onDark}
          apiUrl={apiUrl}
          proseMax={proseMax}
        />
      ))}
    </div>
  )
}

function Prose({ proseMax, children }) {
  return <div className={`mx-auto w-full ${proseMax}`}>{children}</div>
}

function Block({ block, onDark, apiUrl, proseMax }) {
  switch (block.blockType) {
    case 'text':
      return (
        <Prose proseMax={proseMax}>
          <Markdown
            content={block.content}
            className={onDark ? 'markdown-on-dark' : ''}
          />
        </Prose>
      )

    case 'heading': {
      const Tag = block.level === 'h1' ? 'h1' : block.level === 'h3' ? 'h3' : 'h2'
      const size =
        Tag === 'h1'
          ? 'text-3xl sm:text-4xl'
          : Tag === 'h3'
            ? 'text-lg sm:text-xl'
            : 'text-2xl sm:text-3xl'
      return (
        <Prose proseMax={proseMax}>
          <Tag
            className={`font-bold tracking-tight ${size} ${
              onDark ? 'text-white' : 'text-ink'
            }`}
          >
            {block.text}
          </Tag>
        </Prose>
      )
    }

    case 'image': {
      const src = mediaUrl(block.image, apiUrl) || block.imageUrl || ''
      if (!src) return null
      const wide = Boolean(block.wide)
      const figure = (
        <figure className={wide ? 'w-full' : undefined}>
          <div
            className={`overflow-hidden rounded-2xl ${
              onDark ? 'bg-white/5' : 'bg-surface'
            }`}
          >
            <img
              src={src}
              alt={block.alt || block.caption || ''}
              className={`w-full object-cover ${
                wide ? 'aspect-[21/9]' : 'aspect-[4/3]'
              }`}
              loading="lazy"
            />
          </div>
          {block.caption ? (
            <figcaption
              className={`mt-2 text-sm ${onDark ? 'text-white/45' : 'text-muted'}`}
            >
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )
      return wide ? figure : <Prose proseMax={proseMax}>{figure}</Prose>
    }

    case 'video': {
      const url = block.videoUrl || ''
      if (!url) return null
      const isFile = /\.(mp4|webm|ogg)(\?|$)/i.test(url)
      const embed = toEmbedUrl(url)
      const figure = (
        <figure className="w-full">
          <div
            className={`relative aspect-video overflow-hidden rounded-2xl ${
              onDark ? 'bg-white/5' : 'bg-ink'
            }`}
          >
            {isFile ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={url}
                controls
                playsInline
              />
            ) : embed ? (
              <iframe
                title={block.caption || 'Vídeo'}
                src={embed}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : null}
          </div>
          {block.caption ? (
            <figcaption
              className={`mt-2 text-sm ${onDark ? 'text-white/45' : 'text-muted'}`}
            >
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )
      return <Prose proseMax={proseMax}>{figure}</Prose>
    }

    case 'button': {
      const href = block.url || '#'
      const style = block.style || 'primary'
      const base =
        'inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold transition'
      const styles = {
        primary: onDark
          ? 'bg-white text-ink hover:bg-white/90'
          : 'bg-ink text-white hover:bg-ink-soft',
        secondary: onDark
          ? 'border border-white/25 text-white hover:bg-white/10'
          : 'border border-line text-ink hover:bg-surface',
        whatsapp: 'bg-[#25D366] text-black hover:bg-[#1ebe57]',
      }
      return (
        <Prose proseMax={proseMax}>
          <a
            href={href}
            target={isExternal(href) ? '_blank' : undefined}
            rel={isExternal(href) ? 'noreferrer' : undefined}
            className={`${base} ${styles[style] || styles.primary}`}
          >
            {block.label}
          </a>
        </Prose>
      )
    }

    case 'link': {
      const href = block.url || '#'
      return (
        <Prose proseMax={proseMax}>
          <a
            href={href}
            target={isExternal(href) ? '_blank' : undefined}
            rel={isExternal(href) ? 'noreferrer' : undefined}
            className={`inline-flex text-sm font-semibold underline underline-offset-4 ${
              onDark ? 'text-white' : 'text-ink'
            }`}
          >
            {block.label}
          </a>
        </Prose>
      )
    }

    case 'divider':
      return (
        <Prose proseMax={proseMax}>
          <hr className={onDark ? 'border-white/15' : 'border-line'} />
        </Prose>
      )

    default:
      return null
  }
}

/** Normaliza blocos da API Payload para o renderer. */
export function mapPageBlocks(blocks, apiUrl = '') {
  if (!Array.isArray(blocks)) return []
  return blocks
    .map((b) => {
      if (!b?.blockType) return null
      if (b.blockType === 'image') {
        return {
          ...b,
          imageUrl: mediaUrl(b.image, apiUrl) || b.imageUrl || '',
        }
      }
      return b
    })
    .filter(Boolean)
}
