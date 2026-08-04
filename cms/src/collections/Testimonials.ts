import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Depoimento',
    plural: 'Depoimentos',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'rating', 'published', 'order'],
    description: 'Depoimentos da landing — iguais ao site.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Cargo / empresa',
      admin: { description: 'Ex.: CEO, NovaTech Solutions' },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Depoimento',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      label: 'Nota (estrelas)',
      defaultValue: 5,
      min: 1,
      max: 5,
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
