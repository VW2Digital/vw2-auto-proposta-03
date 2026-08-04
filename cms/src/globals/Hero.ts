import type { GlobalConfig } from 'payload'
import { markdownField } from '../fields/markdownField'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero',
  admin: {
    description: 'Primeira seção da home — foto de fundo, altura, textos e CTA.',
    livePreview: {
      url: () => process.env.FRONTEND_URL || 'http://localhost:5173',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'group',
      name: 'media',
      label: 'Foto e tamanho',
      fields: [
        {
          name: 'imageUrl',
          type: 'text',
          label: 'URL da foto de fundo',
          admin: {
            description: 'URL externa ou caminho público (ex.: /hero-team.png).',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto de fundo (upload)',
          admin: {
            description: 'Prioridade sobre a URL, se preenchido.',
          },
        },
        {
          name: 'height',
          type: 'number',
          label: 'Altura do hero (vh)',
          defaultValue: 85,
          min: 50,
          max: 100,
          admin: {
            description: 'Altura mínima da seção em viewport height. 100 = tela cheia.',
            step: 5,
          },
        },
        {
          name: 'objectPosition',
          type: 'text',
          label: 'Posição da foto (object-position)',
          defaultValue: 'center',
          admin: {
            description: 'Ex.: center, center top, 70% center',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      labels: { singular: 'Tag', plural: 'Tags' },
      fields: [{ name: 'label', type: 'text', required: true, label: 'Texto' }],
      defaultValue: [
        { label: 'Design Inteligente' },
        { label: 'Experiências' },
        { label: 'Estratégia' },
        { label: 'Marca' },
      ],
    },
    markdownField({
      name: 'title',
      required: true,
      label: 'Título (Markdown)',
      defaultColor: '#ffffff',
      defaultValue:
        '<span style="color:#ffffff">*Design criativo*</span>\n\n<span style="color:#ffffff">**ESTRATÉGIA**</span>',
      admin: {
        description:
          'O site renderiza este Markdown de verdade: *itálico*, **negrito**, # H1–### H3, cor e tamanho (px). Selecione o texto e use a barra.',
        rows: 6,
      },
    }),
    {
      name: 'subtitle',
      type: 'textarea',
      required: true,
      label: 'Subtítulo',
      defaultValue:
        'Monte sua proposta personalizada em minutos e impulsione o crescimento do seu negócio.',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      required: true,
      label: 'Texto do botão',
      defaultValue: 'Vamos conversar',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link do botão',
      defaultValue: '#proposta',
      admin: {
        description:
          'URL completa (ex.: https://wa.me/55...) ou âncora da página (ex.: #proposta).',
      },
    },
  ],
}
