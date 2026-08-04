import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cms } from '../lib/cms'

export default function VideoSection() {
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    let active = true
    cms.getVideoSection().then((remote) => {
      if (active && remote?.videoUrl) setVideoUrl(remote.videoUrl)
    })
    return () => {
      active = false
    }
  }, [])

  const isDirectVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(videoUrl || '')
  const embedUrl = toEmbedUrl(videoUrl)

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative aspect-video overflow-hidden rounded-[2rem] bg-ink"
        >
          {!videoUrl && (
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  'radial-gradient(ellipse at 70% 30%, rgba(109,140,255,0.7), transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(232,121,249,0.5), transparent 45%)',
              }}
            />
          )}

          {videoUrl && isDirectVideo && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          )}

          {videoUrl && !isDirectVideo && embedUrl && (
            <iframe
              title="Vídeo Nexo Studio"
              src={withAutoplay(embedUrl)}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}

function withAutoplay(embedUrl) {
  if (embedUrl.includes('youtube.com/embed/')) {
    const id = embedUrl.split('/embed/')[1]?.split(/[?#]/)[0]
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0`
  }
  if (embedUrl.includes('vimeo.com')) {
    const sep = embedUrl.includes('?') ? '&' : '?'
    return `${embedUrl}${sep}autoplay=1&muted=1&background=1&loop=1`
  }
  const sep = embedUrl.includes('?') ? '&' : '?'
  return `${embedUrl}${sep}autoplay=1&mute=1`
}

function toEmbedUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.slice(1)
      return `https://www.youtube.com/embed/${id}`
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
