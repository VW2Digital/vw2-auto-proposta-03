const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

export function sitePreview(section) {
  return `${FRONTEND_URL}/preview${section ? `?section=${section}` : ''}`
}

export function proposalPreview(doc) {
  if (doc?.accessToken) {
    return `${FRONTEND_URL}/proposta/${doc.accessToken}`
  }
  return `${FRONTEND_URL}/preview?section=proposals`
}
