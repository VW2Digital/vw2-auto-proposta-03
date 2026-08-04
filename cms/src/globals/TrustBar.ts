import type { GlobalConfig } from 'payload'

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
    {
      type: 'row',
      fields: [
        {
          name: 'line1Prefix',
          type: 'text',
          required: true,
          label: 'Linha 1 — prefixo',
          defaultValue: 'Junte-se a',
          admin: { width: '33%' },
        },
        {
          name: 'line1Stat',
          type: 'text',
          required: true,
          label: 'Destaque',
          defaultValue: '5.000+',
          admin: { width: '33%' },
        },
        {
          name: 'line1Suffix',
          type: 'text',
          required: true,
          label: 'Sufixo',
          defaultValue: 'membros satisfeitos.',
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'line2Prefix',
          type: 'text',
          required: true,
          label: 'Linha 2 — prefixo',
          defaultValue: 'Confiado por',
          admin: { width: '33%' },
        },
        {
          name: 'line2Stat',
          type: 'text',
          required: true,
          label: 'Destaque',
          defaultValue: '5.000+',
          admin: { width: '33%' },
        },
        {
          name: 'line2Suffix',
          type: 'text',
          required: true,
          label: 'Sufixo',
          defaultValue: 'times.',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos / marcas',
      labels: { singular: 'Logo', plural: 'Logos' },
      fields: [{ name: 'name', type: 'text', required: true, label: 'Nome' }],
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
