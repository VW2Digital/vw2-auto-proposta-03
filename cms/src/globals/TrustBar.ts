import type { GlobalConfig } from 'payload'
import { markdownField } from '../fields/markdownField'

export const TrustBar: GlobalConfig = {
  slug: 'trust-bar',
  label: 'Trust Bar',
  admin: {
    description: 'Segunda seção da home (prova social + logos).',
    livePreview: {
      url: () => process.env.FRONTEND_URL || 'http://localhost:5173',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    markdownField({
      name: 'text',
      required: true,
      label: 'Texto (Markdown)',
      defaultValue:
        'Junte-se a **5.000+** membros satisfeitos.\nConfiado por **5.000+** times.',
      admin: {
        description:
          'Use Markdown. Ex.: **negrito** para destaques, *itálico*, quebras de linha.',
        rows: 4,
      },
    }),
    {
      name: 'logos',
      type: 'array',
      label: 'Logos / marcas',
      labels: { singular: 'Logo', plural: 'Logos' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nome',
          admin: {
            description: 'Nome da marca (alt da imagem ou texto se não houver logo).',
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'URL do logo',
          admin: {
            description: 'URL externa ou caminho público (ex.: /logos/marca.svg).',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Upload do logo',
          admin: {
            description: 'Prioridade sobre a URL, se preenchido.',
          },
        },
      ],
      defaultValue: [
        { name: 'Kerala' },
        { name: 'Dean Tadnai' },
        { name: 'Root Media' },
        { name: 'Altitude' },
        { name: 'Northline' },
      ],
    },
  ],
}
