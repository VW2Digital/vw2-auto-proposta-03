import type { CollectionConfig } from 'payload'
import { markdownField } from '../fields/markdownField'
import { sitePreview } from '../lib/preview'

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: {
    singular: 'Case',
    plural: 'Cases',
  },
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'sector', 'result', 'published', 'updatedAt'],
    description: 'Cases de sucesso exibidos na landing (card + texto longo em Markdown).',
    preview: () => sitePreview('cases'),
    livePreview: {
      url: () => sitePreview('cases'),
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'client',
      type: 'text',
      required: true,
      label: 'Cliente',
    },
    {
      name: 'sector',
      type: 'text',
      required: true,
      label: 'Setor',
    },
    {
      name: 'result',
      type: 'text',
      required: true,
      label: 'Resultado principal',
      admin: { description: 'Ex.: +187%' },
    },
    {
      name: 'resultLabel',
      type: 'text',
      required: true,
      label: 'Legenda do resultado',
      admin: { description: 'Ex.: em contatos qualificados' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descrição curta (card do site)',
      admin: {
        description: '1–2 frases exibidas no card da landing.',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'URL da imagem (card)',
      admin: {
        description: 'Imagem 16:9 do case na home. URL externa ou caminho público.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem do case (upload)',
      admin: {
        description: 'Prioridade sobre a URL, se preenchido. Preferir proporção 16:9.',
      },
    },
    markdownField({
      name: 'body',
      label: 'Texto completo (Markdown)',
      admin: {
        description:
          'Use o template em cms/content/templates/case.md. Markdown: títulos, listas, negrito.',
        rows: 18,
      },
    }),
    {
      name: 'metrics',
      type: 'array',
      label: 'Métricas',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'Métrica', plural: 'Métricas' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Label' },
        { name: 'value', type: 'text', required: true, label: 'Valor' },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Publicado',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordem',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
