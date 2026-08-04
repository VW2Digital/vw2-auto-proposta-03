import type { CollectionConfig } from 'payload'
import { proposalPreview } from '../lib/preview'

export const Proposals: CollectionConfig = {
  slug: 'proposals',
  labels: {
    singular: 'Proposta',
    plural: 'Propostas',
  },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'fullName', 'status', 'createdAt'],
    description:
      'Propostas recebidas pelo site. Formalize aqui (status Enviada gera o link do cliente).',
    preview: ({ data }) => proposalPreview(data),
    livePreview: {
      url: ({ data }) => proposalPreview(data),
    },
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Solicitação',
          fields: [
            {
              name: 'fullName',
              type: 'text',
              required: true,
              label: 'Nome completo',
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              label: 'E-mail',
            },
            {
              name: 'whatsapp',
              type: 'text',
              required: true,
              label: 'WhatsApp',
            },
            {
              name: 'company',
              type: 'text',
              required: true,
              label: 'Empresa',
            },
            {
              name: 'website',
              type: 'text',
              label: 'Site',
            },
            {
              name: 'message',
              type: 'textarea',
              label: 'Mensagem do cliente',
            },
            {
              name: 'services',
              type: 'array',
              label: 'Serviços selecionados',
              labels: { singular: 'Serviço', plural: 'Serviços' },
              fields: [
                {
                  name: 'serviceId',
                  type: 'text',
                  required: true,
                  label: 'Slug do serviço',
                  admin: { description: 'Ex.: trafego-pago' },
                },
                { name: 'title', type: 'text', required: true, label: 'Título' },
                { name: 'notes', type: 'textarea', label: 'Observações' },
              ],
            },
          ],
        },
        {
          label: 'Proposta formal',
          fields: [
            {
              name: 'formalPrice',
              type: 'text',
              label: 'Investimento proposto',
              admin: { description: 'Ex.: R$ 8.500 / mês' },
            },
            {
              name: 'formalMessage',
              type: 'textarea',
              label: 'Mensagem para o cliente (Markdown)',
              admin: {
                description:
                  'Texto exibido na página do cliente. Use cms/content/templates/proposta.md.',
                rows: 20,
              },
            },
            {
              name: 'formalNotes',
              type: 'textarea',
              label: 'Notas internas',
              admin: {
                description: 'Só para a equipe — não aparece para o cliente.',
              },
            },
          ],
        },
        {
          label: 'Resposta do cliente',
          fields: [
            {
              name: 'clientResponse',
              type: 'select',
              label: 'Resposta',
              options: [
                { label: 'Aceitou', value: 'accept' },
                { label: 'Negociar', value: 'negotiate' },
              ],
              admin: { readOnly: true },
            },
            {
              name: 'negotiateMessage',
              type: 'textarea',
              label: 'Mensagem de negociação',
              admin: { readOnly: true },
            },
            {
              name: 'clientRespondedAt',
              type: 'date',
              label: 'Cliente respondeu em',
              admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'nova',
      options: [
        { label: 'Nova', value: 'nova' },
        { label: 'Em análise', value: 'em_analise' },
        { label: 'Enviada', value: 'enviada' },
        { label: 'Aceita', value: 'aceita' },
        { label: 'Em negociação', value: 'negociacao' },
        { label: 'Fechada', value: 'fechada' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Enviada em',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'accessToken',
      type: 'text',
      label: 'Token de acesso (link do cliente)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Gerado ao marcar como Enviada. Link: /proposta/{token}',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (!data) return data
        const becomingSent =
          data.status === 'enviada' &&
          (operation === 'create' || originalDoc?.status !== 'enviada')
        if (becomingSent && !data.accessToken) {
          data.accessToken = crypto.randomUUID()
          data.sentAt = data.sentAt || new Date().toISOString()
        }
        return data
      },
    ],
  },
}
