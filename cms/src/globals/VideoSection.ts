import type { GlobalConfig } from 'payload'

export const VideoSection: GlobalConfig = {
  slug: 'video-section',
  label: 'Seção de Vídeo',
  admin: {
    description: 'Terceira seção da home — apenas a URL do vídeo (autoplay).',
    livePreview: {
      url: () => process.env.FRONTEND_URL || 'http://localhost:5173',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      label: 'URL do vídeo',
      admin: {
        description: 'YouTube, Vimeo ou arquivo .mp4 — reproduz em autoplay mudo.',
      },
    },
  ],
}
