import type { GlobalConfig } from 'payload'
import { homeBlocks, pageBlocksField } from '../fields/pageBlocks'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home (página)',
  admin: {
    description:
      'Monte a home com blocos: seções prontas (serviços, cases…) + texto, imagem, vídeo, botão e link.',
    livePreview: {
      url: () => FRONTEND_URL,
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    pageBlocksField({
      name: 'blocks',
      label: 'Blocos da home',
      blocks: homeBlocks,
      description:
        'Arraste para reordenar. Use “Seção do site” para módulos prontos, ou adicione texto/imagem/vídeo/botão/link.',
    }),
  ],
}
