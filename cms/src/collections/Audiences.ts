import type { CollectionConfig } from 'payload'
import { sitePreview } from '../lib/preview'

export const Audiences: CollectionConfig = {
  slug: 'audiences',
  labels: {
    singular: 'Público',
    plural: 'Quem ajudamos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'icon', 'published', 'order'],
    description: 'Cards da seção “Quem ajudamos” — iguais ao site.',
    preview: () => sitePreview('quem-ajudamos'),
    livePreview: {
      url: () => sitePreview('quem-ajudamos'),
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descrição',
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      label: 'Ícone',
      options: [
        { label: 'Foguete', value: 'Rocket' },
        { label: 'Pasta', value: 'Briefcase' },
        { label: 'Formatura', value: 'GraduationCap' },
        { label: 'Saúde', value: 'HeartPulse' },
        { label: 'Usuários', value: 'Users' },
        { label: 'Lâmpada', value: 'Lightbulb' },
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
