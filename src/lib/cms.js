const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      data?.errors?.[0]?.message || data?.error || data?.message || `Erro ${res.status}`,
    )
  }
  return data
}

function mediaUrl(media) {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (media.url?.startsWith('http')) return media.url
  if (media.url) return `${API_URL}${media.url}`
  return ''
}

function mapProject(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug || String(p.id),
    category: p.category,
    client: p.client || '',
    year: p.year || '',
    tall: Boolean(p.tall),
    image: p.imageUrl || mediaUrl(p.image),
    description: p.description || '',
    blocks: mapBlocks(p.blocks),
    gallery: (p.gallery || [])
      .map((g) => ({
        image: g.imageUrl || mediaUrl(g.image),
        caption: g.caption || '',
        wide: Boolean(g.wide),
      }))
      .filter((g) => g.image),
  }
}

function mapBlocks(blocks) {
  if (!Array.isArray(blocks)) return []
  return blocks
    .map((b) => {
      if (!b?.blockType) return null
      if (b.blockType === 'image') {
        return {
          id: b.id,
          blockType: b.blockType,
          image: mediaUrl(b.image) || b.imageUrl || '',
          imageUrl: mediaUrl(b.image) || b.imageUrl || '',
          alt: b.alt || '',
          caption: b.caption || '',
          wide: Boolean(b.wide),
        }
      }
      if (b.blockType === 'text') {
        return { id: b.id, blockType: 'text', content: b.content || '' }
      }
      if (b.blockType === 'heading') {
        return {
          id: b.id,
          blockType: 'heading',
          text: b.text || '',
          level: b.level || 'h2',
        }
      }
      if (b.blockType === 'video') {
        return {
          id: b.id,
          blockType: 'video',
          videoUrl: b.videoUrl || '',
          caption: b.caption || '',
        }
      }
      if (b.blockType === 'button') {
        return {
          id: b.id,
          blockType: 'button',
          label: b.label || '',
          url: b.url || '#',
          style: b.style || 'primary',
        }
      }
      if (b.blockType === 'link') {
        return {
          id: b.id,
          blockType: 'link',
          label: b.label || '',
          url: b.url || '#',
        }
      }
      if (b.blockType === 'divider') {
        return { id: b.id, blockType: 'divider' }
      }
      if (b.blockType === 'module') {
        return { id: b.id, blockType: 'module', module: b.module }
      }
      return { ...b }
    })
    .filter(Boolean)
}

export const cms = {
  apiUrl: API_URL,
  adminUrl: `${API_URL}/admin`,

  async getProjects({ all = false } = {}) {
    try {
      const filter = all ? '' : 'where[featured][equals]=true&'
      const data = await api(
        `/api/projects?${filter}sort=order&limit=100&depth=1`,
      )
      return (data.docs || []).map(mapProject)
    } catch {
      return null
    }
  },

  async getProject(slug) {
    if (!slug) return null
    try {
      const data = await api(
        `/api/projects?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
      )
      const doc = data.docs?.[0]
      return doc ? mapProject(doc) : null
    } catch {
      return null
    }
  },

  async getHomePage() {
    try {
      const data = await api('/api/globals/home-page?depth=1')
      return {
        blocks: mapBlocks(data.blocks),
      }
    } catch {
      return null
    }
  },

  async getCases() {
    try {
      const data = await api(
        '/api/cases?where[published][equals]=true&sort=order&limit=100',
      )
      return (data.docs || []).map((c) => ({
        id: c.id,
        client: c.client,
        sector: c.sector,
        result: c.result,
        resultLabel: c.resultLabel,
        description: c.description,
        body: c.body || '',
        metrics: c.metrics || [],
      }))
    } catch {
      return null
    }
  },

  async getServices() {
    try {
      const data = await api(
        '/api/services?where[active][equals]=true&sort=order&limit=50',
      )
      return (data.docs || []).map((s) => ({
        id: s.slug || String(s.id),
        title: s.title,
        description: s.description,
        icon: s.icon,
      }))
    } catch {
      return null
    }
  },

  async getAudiences() {
    try {
      const data = await api(
        '/api/audiences?where[published][equals]=true&sort=order&limit=20',
      )
      return (data.docs || []).map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        icon: a.icon,
      }))
    } catch {
      return null
    }
  },

  async getTestimonials() {
    try {
      const data = await api(
        '/api/testimonials?where[published][equals]=true&sort=order&limit=20',
      )
      return (data.docs || []).map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        quote: t.quote,
        rating: t.rating || 5,
      }))
    } catch {
      return null
    }
  },

  async getHero() {
    try {
      const data = await api('/api/globals/hero?depth=1')
      const media = data.media || {}
      const legacyTitle =
        data.headlineSerif || data.headlineBold
          ? `*${data.headlineSerif || ''}*\n\n**${data.headlineBold || ''}**`.trim()
          : ''
      return {
        tags: (data.tags || []).map((t) => t.label).filter(Boolean),
        title: data.title || legacyTitle || '',
        subtitle: data.subtitle,
        ctaLabel: data.ctaLabel,
        ctaLink: data.ctaLink || data.ctaTarget || '#proposta',
        image: mediaUrl(media.image) || media.imageUrl || '',
        height: Number(media.height) || 85,
        objectPosition: media.objectPosition || 'center',
      }
    } catch {
      return null
    }
  },

  async getTrustBar() {
    try {
      const data = await api('/api/globals/trust-bar?depth=1')
      const legacyText =
        data.line1Stat || data.line2Stat
          ? [
              [data.line1Prefix, data.line1Stat && `**${data.line1Stat}**`, data.line1Suffix]
                .filter(Boolean)
                .join(' '),
              [data.line2Prefix, data.line2Stat && `**${data.line2Stat}**`, data.line2Suffix]
                .filter(Boolean)
                .join(' '),
            ]
              .filter(Boolean)
              .join('\n')
          : ''
      return {
        text: data.text || legacyText || '',
        logos: (data.logos || [])
          .map((l) => ({
            name: l.name || '',
            image: mediaUrl(l.image) || l.imageUrl || '',
          }))
          .filter((l) => l.name || l.image),
      }
    } catch {
      return null
    }
  },

  async getVideoSection() {
    try {
      const data = await api('/api/globals/video-section')
      return {
        videoUrl: data.videoUrl || '',
      }
    } catch {
      return null
    }
  },

  async createProposal(payload) {
    return api('/api/proposals', {
      method: 'POST',
      body: JSON.stringify({
        fullName: payload.fullName,
        email: payload.email,
        whatsapp: payload.whatsapp,
        company: payload.company,
        website: payload.website || undefined,
        message: payload.message || undefined,
        services: (payload.services || []).map((s) => ({
          serviceId: s.serviceId || s.id,
          title: s.title,
          notes: s.notes || '',
        })),
        status: payload.status || 'nova',
      }),
    })
  },

  async unlockProposal(token, password) {
    return api(`/api/public/proposals/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  },

  async respondProposal(token, password, action, message = '') {
    return api(`/api/public/proposals/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password, action, message }),
    })
  },
}
