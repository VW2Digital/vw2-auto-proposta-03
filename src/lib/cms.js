/**
 * Cliente da API do Nexo CMS (Laravel).
 * A API já entrega os dados no formato usado pelos componentes:
 * camelCase, URLs de imagem absolutas e blocos com `blockType`.
 */
const rawApiUrl = import.meta.env.VITE_API_URL
const API_URL = (
  rawApiUrl !== undefined
    ? rawApiUrl
    : import.meta.env.PROD
      ? ''
      : 'http://localhost:8000'
).replace(/\/$/, '')

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const firstValidation = body?.errors && Object.values(body.errors)[0]?.[0]
    throw new Error(body?.error || firstValidation || body?.message || `Erro ${res.status}`)
  }
  return body
}

/** GET que devolve `data` ou `null` se a API estiver fora do ar. */
async function get(path) {
  try {
    const body = await api(path)
    return body.data ?? null
  } catch {
    return null
  }
}

export const cms = {
  apiUrl: API_URL,
  adminUrl: `${API_URL}/admin`,

  getProjects: ({ all = false } = {}) => get(`/projects${all ? '?all=1' : ''}`),

  getProject: (slug) => (slug ? get(`/projects/${encodeURIComponent(slug)}`) : null),

  getHomePage: () => get('/globals/home-page'),

  getCases: () => get('/cases'),

  getServices: () => get('/services'),

  getAudiences: () => get('/audiences'),

  getTestimonials: () => get('/testimonials'),

  getHero: () => get('/globals/hero'),

  getTrustBar: () => get('/globals/trust-bar'),

  getVideoSection: () => get('/globals/video-section'),

  async createProposal(payload) {
    return api('/proposals', {
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
      }),
    })
  },

  async unlockProposal(token, password) {
    return api(`/public/proposals/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  },

  async respondProposal(token, password, action, message = '') {
    return api(`/public/proposals/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password, action, message }),
    })
  },
}
