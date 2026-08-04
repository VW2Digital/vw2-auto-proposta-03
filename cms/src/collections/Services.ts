import type { CollectionConfig } from 'payload'
import { sitePreview } from '../lib/preview'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Serviço',
    plural: 'Serviços',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'active', 'order', 'updatedAt'],
    description: 'Serviços do site e da montagem de proposta (iguais à landing).',
    preview: () => sitePreview('servicos'),
    livePreview: {
      url: () => sitePreview('servicos'),
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug (ID)',
      admin: {
        description: 'Ex.: identidade-visual — usado na seleção da proposta.',
      },
    },
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
        { label: 'Paleta', value: 'Palette' },
        { label: 'Compartilhar', value: 'Share2' },
        { label: 'Megafone', value: 'Megaphone' },
        { label: 'Layout', value: 'Layout' },
        { label: 'Lâmpada', value: 'Lightbulb' },
        { label: 'Database', value: 'Database' },
        { label: 'Usuários', value: 'Users' },
        { label: 'Claquete', value: 'Clapperboard' },
        { label: 'Bot', value: 'Bot' },
        { label: 'Mapa', value: 'MapPin' },
        { label: 'Bússola', value: 'Compass' },
        { label: 'Foguete', value: 'Rocket' },
        { label: 'Pasta', value: 'Briefcase' },
        { label: 'Formatura', value: 'GraduationCap' },
        { label: 'Saúde', value: 'HeartPulse' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Ativo',
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
